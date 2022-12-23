import Tile from "./Tile/tile";

type BoardProps = {
    word: string,
    tries: number,
    wordLength: number,
    chars: Array<Array<string>>,
    completedRows: Array<number>
};



export default function Board(props: BoardProps) {
    if (!props) return <div>"Loading..."</div>;
    
    const computeValidTile = (indexTentative: number, char: string, indexChar: number) => {
        if (char === "" || (props.completedRows.indexOf(indexTentative) < 0)) {
            // case empty => do not map to class
            return 0;
        } else if (props.word.charAt(indexChar) === char) {
            // case correct => map to class correct
            return 3;
        } else if (props.word.indexOf(char) > -1) {
            // case misplaced => map to class misplaced
            return 2;
        } else {
            // case incorrect => map to class incorrect
            return 1;
        }
    }

    return (
        <div className="flex flex-col gap-2">
            {
                props.chars.map((charTentative, indexTentative) => {
                    return (
                        <div key={`tentative-${indexTentative}`} className="grid grid-cols-5 gap-2 h-16 m-auto">
                            {charTentative.map((char, indexChar) => (<Tile key={`tile-${indexTentative}-${indexChar}`} character={char} valid={computeValidTile(indexTentative, char, indexChar)}></Tile>))}
                        </div>
                    )
                })
            }
        </div>
    )
}