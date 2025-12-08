import fs from "fs";
import path from "path"; 

const STATE_FILE_PATH = path.join(__dirname, "queryState.json");
// koristimo fajl queryState.json za cuvanje stanja pri gasenju servisa
// kako bismo mogli da nastavimo od poslednjeg procesiranog event-a i 
// i da ne moramo ponovo da pravimo inverted indeks strukturu od pocetka
// u ovom fajlu cuvamo lastProcessedId, invertedIndex i eventTokenMap

export function loadQueryState(): {
    lastProcessedId: number;
    invertedIndex: Map<string, Set<number>>,
    eventTokenMap: Map<number, string[]>
} {
    if (!fs.existsSync(STATE_FILE_PATH)) {
        return {
            lastProcessedId: 0,
            invertedIndex: new Map<string, Set<number>>(),
            eventTokenMap: new Map<number, string[]>()
        };
    }

    const rawData = fs.readFileSync(STATE_FILE_PATH, 'utf-8');
    const parsedData = JSON.parse(rawData);

    const invertedIndex = new Map<string, Set<number>>();
    for (const key in Object.keys(parsedData.invertedIndex)) {
        invertedIndex.set(key, new Set(parsedData.invertedIndex[key]));
    }

    const eventTokenMap = new Map<number, string[]>();
    for (const key in Object.keys(parsedData.eventTokenMap)) {
        eventTokenMap.set(Number(key), parsedData.eventTokenMap[key]);
    }

    return {
        lastProcessedId: parsedData.lastProcessedId || 0,
        invertedIndex,
        eventTokenMap
    };
}

export function saveQueryState(state: {
    lastProcessedId: number;
    invertedIndex: Map<string, Set<number>>,
    eventTokenMap: Map<number, string[]>
}) {
    const serialized = {
        lastProcessedId: state.lastProcessedId,
        invertedIndex: Object.fromEntries(
            Array.from(state.invertedIndex.entries())
                .map(([key, value]) => [key, Array.from(value)])),
        eventTokenMap: Object.fromEntries(state.eventTokenMap)    
    };

    fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(serialized, null, 2), 'utf-8');
}