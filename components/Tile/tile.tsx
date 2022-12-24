import { Theme } from '../../lib/theme';

type TileProps = {
    character: string,
    valid: number,
    theme: Theme
};

export default function Tile(props: TileProps) {
    const getStyle = () => {
        console.log(props.valid);
        let classname = "p-3 border-solid border-2 border-gray-500 rounded-md text-center app-cell ";
        if (props.valid === 1) classname += props.theme.bgInvalid;
        else if (props.valid === 2) classname +=  props.theme.bgMisplaced;
        else if (props.valid === 3) classname +=  props.theme.bgValid;
        return classname;
      };
    return (
        <div className={getStyle()}>
            {props.character}
        </div>
    )
}