import Tile from "./Tile/tile";

type BoardProps = {
    word: string,
    tries: number,
    wordLength: number,
    currentTentative: string,
    tentatives: Array<string>
};

const padTentative = (tentative: string, wordLength: number) => {
    return tentative.padEnd(wordLength, " ");
}

export default function Board(props: BoardProps) {
    if (!props) return <div>"Loading..."</div>;
    
    const computeValidTile = (indexTentative: number, char: string, indexChar: number) => {
        if (char === "" || char === " ") {
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
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-5 gap-2 h-16 m-auto">
                        {padTentative(props.currentTentative, props.wordLength).split("").map((char, indexChar) => (<Tile key={`tile-currtent-${indexChar}`} character={char} valid={0}></Tile>))}
                    </div>
            </div>
            <div className="flex flex-col gap-2">
                {
                    props.tentatives.map((tentative, indexTentative) => {
                        return (
                            <div key={`tentative-${indexTentative}`} className="grid grid-cols-5 gap-2 h-16 m-auto">
                                {tentative.split("").map((char, indexChar) => (<Tile key={`tile-${indexTentative}-${indexChar}`} character={char} valid={computeValidTile(indexTentative, char, indexChar)}></Tile>))}
                            </div>
                        )
                    })
                    // props.chars.map((charTentative, indexTentative) => {
                    //     return (
                    //         <div key={`tentative-${indexTentative}`} className="grid grid-cols-5 gap-2 h-16 m-auto">
                    //             {charTentative.map((char, indexChar) => (<Tile key={`tile-${indexTentative}-${indexChar}`} character={char} valid={computeValidTile(indexTentative, char, indexChar)}></Tile>))}
                    //         </div>
                    //     )
                    // })
                }
            </div>
        </div>
       
    )
}