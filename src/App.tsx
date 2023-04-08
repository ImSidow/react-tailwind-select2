import { useCallback } from "react";
import Select2 from "./components/Select2";

const people = [
    { name: "Wade Cooper" },
    { name: "Arlene Mccoy" },
    { name: "Devon Webb" },
    { name: "Tom Cook" },
    { name: "Tanya Fox" },
    { name: "Hellen Schmidt" },
];

function App() {
    const handleLazyLoadOptions = useCallback((search: string) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const result = [{ name: "Maxamed Nuur" }, { name: "Xasan Cilmi" }, { name: "Jamac Maxamed" }];
                // resolve(result.filter((item) => item.name.toLowerCase().includes(search.toLowerCase())));
                resolve(result);
            }, 1000);
        }) as Promise<{ name: string }[]>;
    }, []);

    return (
        <div className="h-screen flex flex-col items-center pt-10">
            <h1 className="text-2xl mb-10">React Tailwind Select2 (headless ui list box)</h1>

            <Select2
                options={people}
                selected={people[1]}
                lazyLoadOptions={handleLazyLoadOptions}
                renderSelectedItem={(selected) => (
                    <div className="flex items-center">
                        <img src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow" className="h-4 w-auto" />
                        <span className="ml-3 block truncate">{selected.name}</span>
                    </div>
                )}
                renderOption={({ item, selected }) => (
                    <div className="flex items-center">
                        {/* <img src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow" className="h-4 w-auto" /> */}
                        <span className="ml-3 block truncate">{item.name}</span>
                    </div>
                )}
            />
        </div>
    );
}

export default App;
