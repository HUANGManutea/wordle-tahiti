
type DrawerProps = {
    isOpen: boolean,
    setIsOpen: Function,
    children: any
}

export default function Drawer(props: DrawerProps) {
    return (
        <main className={
            "flex flex-row fixed overflow-hidden z-10 bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out " +
            (props.isOpen
              ? "transition-opacity opacity-100 duration-500 translate-x-0"
              : "transition-all delay-500 opacity-0 translate-x-full")
          }>
            <section className="flex flex-col p-5 w-9/12sm:w-1/4 border-solid border-r-2 border-gray-300 bg-gray-700 overflow-y-auto">
                {props.children}
            </section>
            <section
                className="w-screen h-full cursor-pointer"
                onClick={() => {
                props.setIsOpen(false);
                }}
            ></section>
        </main>
    )
}