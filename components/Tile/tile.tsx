import styles from './Tile.module.css'

type TileProps = {
    character: string,
    valid: number
};

export default function Tile(props: TileProps) {
    const getStyle = () => {
        let classname = "p-3 border-solid border-2 border-gray-500 rounded-md h-16 w-16 text-center ";
        if (props.valid === 1) classname += styles.invalid;
        else if (props.valid === 2) classname +=  styles.misplaced;
        else if (props.valid === 3) classname +=  styles.valid;
        return classname;
      };
    return (
        <div className={getStyle()}>
            {props.character}
        </div>
    )
}