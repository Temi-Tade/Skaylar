const NUMBERS = [];
const DIGITS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const REPS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const FREQUENCY = {
    one: { frequency: 0, occurrence: 0 },
    two: { frequency: 0, occurrence: 0 },
    three: { frequency: 0, occurrence: 0 },
    four: { frequency: 0, occurrence: 0 },
    five: { frequency: 0, occurrence: 0 },
    six: { frequency: 0, occurrence: 0 },
    seven: { frequency: 0, occurrence: 0 },
    eight: { frequency: 0, occurrence: 0 },
    nine: { frequency: 0, occurrence: 0 }
};
const EXPECTED = [30.10, 17.61, 12.49, 9.69, 7.92, 6.69, 5.80, 5.12, 4.58];
const PARAMS = {
    name: undefined,
    description: undefined,
    source: undefined,
    startingValue: undefined,
    currentValue: undefined,
    growthRate: undefined,
    runs: undefined,
    externalData : []
};
const MOCK_DATA_PROMPT = "Mock dataset selected. Click 'Run Test'..."

function init() {
    //NUMBERS.push(PARAMS.startingValue);
    PARAMS.currentValue = PARAMS.externalData.length > 0 ? PARAMS.externalData[0] : PARAMS.startingValue;
    
    dataset.textContent = PARAMS.name || "N/A";
    description.textContent = PARAMS.description || "N/A";
    source.textContent = PARAMS.source || "N/A"
    starting.textContent = PARAMS.startingValue;
    current.textContent = PARAMS.currentValue;
    rate.textContent = `${PARAMS.growthRate}%`;
    size.textContent = PARAMS.externalData.length > 0 ? PARAMS.externalData.length : PARAMS.runs;
    //PARAMS.externalData = []
    
    DIGITS.map((d, i) => {
        dist.innerHTML += `
            <tr>
                <td id='${d}'>${i+1}</td>
                <td id='${d}_freq'>0</td>
                <td id='${d}_occ'>0</td>
                <td id='${d}_exp'>${EXPECTED[i].toFixed(2)}</td>
                <td id='${d}_dev' class='dev'>0</td>
            </tr>
        `;
    })
}

function testBenford(dataset) {
    if (dataset.length > 0) {
        updateCurrentValue();
    } else {
        const increase = (PARAMS.growthRate/100) * PARAMS.currentValue;
        updateCurrentValue(increase);
    }
}

function updateCurrentValue(val) {
    if (PARAMS.externalData.length > 0) {
        for (let d of PARAMS.externalData) {
            if (d === 0) {
                continue;
            }
            
            PARAMS.currentValue = d;
            
            NUMBERS.push(+PARAMS.currentValue);
            current.textContent = +PARAMS.currentValue.toFixed(2);
            
            const firstDigit = +PARAMS.currentValue.toString()[0];
            const id = DIGITS[REPS.indexOf(firstDigit)];
            log(id);
        }
    } else {
        PARAMS.currentValue += val;
        NUMBERS.push(+PARAMS.currentValue.toFixed(2));
        current.textContent = +PARAMS.currentValue.toFixed(2);
        
        const firstDigit = +PARAMS.currentValue.toString()[0];
        const id = DIGITS[REPS.indexOf(firstDigit)];
        log(id);
    }
}

function log(elementID) {
    FREQUENCY[elementID].frequency += 1;
    FREQUENCY[elementID].occurrence = ((FREQUENCY[elementID].frequency/(PARAMS.externalData.length > 0 ? PARAMS.externalData.length : NUMBERS.length)) * 100).toFixed(2);

    document.querySelector(`#${elementID}_freq`).textContent = FREQUENCY[elementID].frequency;
    document.querySelector(`#${elementID}_occ`).textContent = FREQUENCY[elementID].occurrence;
    document.querySelector(`#${elementID}_dev`).textContent = (FREQUENCY[elementID].occurrence - EXPECTED[Object.keys(FREQUENCY).indexOf(elementID)]).toFixed(2);
}

function plot(obj) {
    const isArray = Array.isArray(obj);
    const keys = isArray? obj.map((_, i) => i) : Object.keys(obj);
    const values = keys.map((k, i) => {
        const val = isArray? obj[k] : obj[k].occurrence;
        const x = (((i + 1) / 9) * 300).toFixed(2)
        const y = (300 - (val / 40) * 300).toFixed(2);

        return `${x} ${y}`;
    });
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", `M ${values[0]} C ${values.slice(1).join(' ')}`);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", obj[0] ? "#5555FF" : "#FF5555");
    path.setAttribute("stroke-width", "3");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    
    svg.appendChild(path)
}

function calculateChiSquare() {
    let chiSquareValue = 0;
    for(let i = 0; i < 9; i++) {
        const expectedOccurence = (EXPECTED[i]/100) * NUMBERS.length;
        const actualOccurence = FREQUENCY[DIGITS[i]].frequency;
        
        chiSquareValue += ((actualOccurence - expectedOccurence)**2) / expectedOccurence;
    }
    return chiSquareValue.toFixed(2);
}

function interpretResult() {
    const deviations = [...document.querySelectorAll(".dev")].map(d => +d.textContent);
    maxDev.textContent = `Max Deviation: ${Math.max(...deviations)}`;
    chiSquare.textContent = `Chi-square: ${calculateChiSquare()}`;
}

function runTest() {
    plot(EXPECTED);
    performance.mark("start");

    const finish = () => {
        performance.mark("end"); // <-- moved here
        performance.measure('duration', 'start', 'end');
      
        duration.textContent = `Analysis completed in ${(performance.getEntriesByName('duration')[0].duration/1000).toFixed(2)}s`;
        form.style.display = "none";
        result.style.display = "block";
      
        performance.clearMarks();
        performance.clearMeasures();
    }
    
    if (PARAMS.externalData.length > 0) {
        testBenford(PARAMS.externalData);
        plot(FREQUENCY);
        finish();
        interpretResult();
    } else {
        if (data.value === MOCK_DATA_PROMPT) {
            let completed = 0;
            for (let i = 0; i < PARAMS.runs; i++) {
                testBenford(PARAMS.externalData);
                completed++;
                if (completed === PARAMS.runs) {
                    plot(FREQUENCY);
                    finish();
                    interpretResult();
                }
            }
        }
    }
}

async function selectDataset() {
    let datasets = "";
    const fileNames = await fetch("./data/")
        .then(res => res.text())
        .then(data => data);
    
        temp.innerHTML = fileNames;
        
        const files = [...temp.querySelectorAll('.filename')];
        const sizes = [...temp.querySelectorAll('.filesize')];
        
        files.forEach((f,i) => {
            datasets += `
            <li>
                <i data-lucide="table" width="12"></i>
                <button class="set" id="${files[i].innerHTML}">
                    ${files[i].innerHTML} ${sizes[i].innerHTML}
                </button>
            </li>`
        });
        return datasets;
}

function importDataset(ds) {
    PARAMS.name = ds?.name;
    PARAMS.description = ds?.description;
    PARAMS.source = ds?.source;
    
    const rawData = ds?.data;
    if (Array.isArray(rawData)) {
        data.value = rawData.join(", ");
        PARAMS.externalData = rawData;
        PARAMS.startingValue = rawData[0];
        PARAMS.currentValue = 0;
        PARAMS.growthRate = "N/A";
    } else {
        data.value = MOCK_DATA_PROMPT;
        PARAMS.startingValue = rawData.startingValue;
        PARAMS.currentValue = rawData.currentValue;
        PARAMS.growthRate = rawData.growthRate;
        PARAMS.runs = rawData.runs;
    }
    
    data.readOnly = true;
}

data.oninput = function(e) {
    const input = e.target.value.trim();
    const formattedInput = input.endsWith(",") ? input.substring(0, input.length - 1) : input;
    const arrayFromInput = formattedInput.split(/[,\s\n]+/).map(v => v.trim() === "" ? "" : +v);

    if (arrayFromInput.length > 0 && arrayFromInput[0] !== "") {
        runBtn.textContent = "Run Test";
        PARAMS.startingValue = arrayFromInput[0];
        PARAMS.externalData = arrayFromInput;
        PARAMS.growthRate = "N/A";
    } else {
        runBtn.textContent = "Run Test (Mock Data)";
        PARAMS.externalData = [];
        PARAMS.startingValue = 10;
        PARAMS.growthRate = 10;
    }
}

runBtn.onclick = async function() {
    try {
        if (data.value.trim().length) {
            const arrayFromInput = data.value.trim().split(/[,\s\n]+/).map(v => v.trim() === "" ? "" : +v);
            if (arrayFromInput.some(e => isNaN(+e)) && data.value !== MOCK_DATA_PROMPT) {
                alert("An error occured: Invalid input");
                return;
            }
        } else {
            createModal(`
                <h3>Datasets</h3>
                <ul id="datalist">
                    ${await selectDataset()}
                </ul>
            `);
            
            [...document.querySelectorAll(".set")].forEach(s => {
                s.onclick = async function() {
                    selectedDataset.textContent = `Selected Dataset: ${s.id}`;
                    await fetch(`./data/${s.id}`)
                    .then(res => res.json())
                    .then(data => {
                        importDataset(data)
                        closeModal();
                        runBtn.textContent = "Run Test"
                    });
                }
            })
            
            return;
        }
        
        runBtn.textContent = "Running...";
        runBtn.disabled = true;
        init();
        runTest();
    } catch (e) {
        console.error(e);
    }
}

runNewBtn.onclick = function() {
    history.go(0);
    /*runBtn.textContent = data.value.trim().length > 0 ? "Run Test" : "Selected Dataset";
    runBtn.disabled = false;
    form.style.display = "flex";
    result.style.display = "none";
    [...document.querySelectorAll("tr")].slice(1).forEach(tr => dist.removeChild(tr.parentElement));
    svg.innerHTML = "";
    NUMBERS.splice(0, NUMBERS.length);
    Object.keys(FREQUENCY).forEach(f => {
        FREQUENCY[f].occurrence = 0;
        FREQUENCY[f].frequency = 0;
    });
    maxDev.textContent = "";
    chiSquare.textContent = "";
    data.readonly = false;
    
    for (var p in PARAMS) {
        PARAMS[p] = undefined;
        if (p === "externalData") {
            PARAMS.externalData = [];
        }
    }
    
    console.log(PARAMS)*/
}