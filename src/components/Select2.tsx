import { Fragment, useEffect, useId, useMemo, useRef, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

type Select2Props<T> = {
    options: T[];
    selected?: T;
    renderSelectedItem: (item: T) => JSX.Element;
    renderOption: (param: { item: T; selected: boolean }) => JSX.Element;
    lazyLoadOptions?: (search: string) => Promise<T[]>;
};

const Select2 = <T,>({ renderSelectedItem, options, selected, renderOption, lazyLoadOptions }: Select2Props<T>) => {
    const [isListboxOptionsOpen, setIsListboxOptionsOpen] = useState(false);
    const [$options, setOptions] = useState(options);
    const [$selected, setSelected] = useState(selected ?? options[0]);
    const [search, setSearch] = useState("");
    const isLoading = useRef(false);
    const [rerender, setRerender] = useState(0);
    const inputId = useId();

    useEffect(() => {
        const input = document.getElementById(inputId);
        if (!input) return;
        input.focus();
    }, [isListboxOptionsOpen]);

    const filterOptionsBySearchKey = (options: T[], search: string) => {
        if (!search) return options;
        const filteredOptions = options.filter((option) => {
            const optionString = JSON.stringify(option);
            return optionString.toLowerCase().includes(search.toLowerCase());
        });
        return filteredOptions;
    };

    const lazyLoad = (search: string) => {
        if (!lazyLoadOptions) return;
        if (isLoading.current) return;
        isLoading.current = true;

        lazyLoadOptions(search).then((loadedOptions) => {
            console.log("loaded");
            if (loadedOptions.length > 0) setOptions([...$options, ...loadedOptions]);
            else setRerender((prev) => prev + 1);
            isLoading.current = false;
        });
    };

    const filteredOptions = useMemo(() => {
        const filteredOptions = filterOptionsBySearchKey($options, search);
        if (filteredOptions.length > 0) return filteredOptions;
        lazyLoad(search);
        return [];
    }, [search, $options]);

    const renderFilteredOptions = () => {
        if (filteredOptions.length === 0 && isLoading.current) {
            return (
                <div className="relative cursor-default select-none px-3 py-2 text-gray-400">
                    <span>Loading...</span>
                </div>
            );
        }

        if (filteredOptions.length === 0) {
            return (
                <div className="relative cursor-default select-none px-3 py-2 text-gray-400">
                    <span>No element found</span>
                </div>
            );
        }

        return filteredOptions.map((option, idx) => (
            <Listbox.Option
                key={idx}
                className={({ active }) => `relative cursor-default select-none py-2 ${active ? "bg-amber-100 text-amber-900" : "text-gray-900"}`}
                value={option}
            >
                {({ selected }) => renderOption({ item: option, selected })}
            </Listbox.Option>
        ));
    };

    return (
        <div className="relative w-1/6">
            <Listbox value={$selected} onChange={setSelected}>
                <div className="relative mt-1">
                    <Listbox.Button
                        onClick={() => setIsListboxOptionsOpen(!isListboxOptionsOpen)}
                        className="relative w-full cursor-default rounded-lg bg-gray-100 border border-gray-300 py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
                    >
                        <span className="block truncate">{renderSelectedItem($selected)}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                    </Listbox.Button>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto p-0 rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            <div className="sticky -top-1 z-50 p-1 bg-white">
                                <input
                                    type="text"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Search..."
                                    id={inputId}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <div className="pt-1">{renderFilteredOptions()}</div>
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
};
export default Select2;
