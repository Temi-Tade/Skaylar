import handleFileUpload from './lib/fileHandler.js';
import pointsToSmoothPath from './lib/graph.js';
import saveDataset from './lib/saveDataset.js'
import { createModal, closeModal, saveFile } from './lib/ui.js';

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
const MOCK_DATA_PROMPT = "Mock dataset selected. Click 'Run Test'...";
const GRAPH_DATA = {
    yZoom: 35, // max expected is ~30.10
    actualLabelColor: "#FF5555",
    expectedLabelColor: "#5555FF",
    yMax: undefined,
    showLabel: true
}

let isManualInput;

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
                NUMBERS.push(d);
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
    let yMax = 0;
    
    const isArray = Array.isArray(obj);
    const keys = isArray? obj.map((_, i) => i) : Object.keys(obj);
    const values = keys.map((k, i) => {
        const val = isArray? obj[k] : obj[k].occurrence;
        const x = (((i + 1) / 10) * 290 + 5).toFixed(2)
        const y = (295 - (val / GRAPH_DATA.yZoom) * 285).toFixed(2);
        yMax = (+val > yMax) ? +val : yMax;

        return `${x} ${y}`;
    });
    
    
    GRAPH_DATA.yMax = yMax + 5;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pointsToSmoothPath(values));
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", obj[0] ? GRAPH_DATA.expectedLabelColor : GRAPH_DATA.actualLabelColor);
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
    createModal("Please wait...");
    let datasets = "";
    const files = await fetch("./data/manifest.json")
        .then(res => {
            if (!res.ok) {
                createModal("An error occured. Please check your connection and try again.");
                return;
            } else {
                return res.json()
            }
        })
        .then(data => data.sort());
        
        files.forEach((f,i) => {
            datasets += `
            <li>
                <i data-lucide="table" width="12"></i>
                <button class="set" id="${files[i]}">
                    ${files[i]}
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
    closeModal();
    runBtn.textContent = "Run Test";
}

////////////
// events //
////////////

data.oninput = function(e) {
    const input = e.target.value.trim();
    const formattedInput = input.endsWith(",") ? input.substring(0, input.length - 1) : input;
    const arrayFromInput = formattedInput.split(/[,\s\n]+/).map(v => v.trim() === "" ? "" : +v);

    if (arrayFromInput.length > 0 && arrayFromInput[0] !== "") {
        runBtn.textContent = "Run Test";
        PARAMS.startingValue = arrayFromInput[0];
        PARAMS.externalData = arrayFromInput;
        PARAMS.growthRate = "N/A";
        isManualInput = true;
    } else {
        runBtn.textContent = "Select Dataset";
        PARAMS.externalData = [];
        PARAMS.startingValue = 10;
        PARAMS.growthRate = 10;
        isManualInput = false;
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
                <h3>Select a Dataset</h3>
                <ul id="datalist">
                    ${await selectDataset()}
                </ul>
                <p style='text-align: center; margin: .5rem auto'>or</p>
                ${handleFileUpload()}
            `);
            
            if (fileInput) {
                fileInput.onchange = function(e) {
                    const file = e.target.files[0];
                    if (!file.type.includes("json") && !file.name.endsWith(".json")) {
                        alert("Please upload a JSON file.");
                        return;
                    }
                    
                    file.text()
                    .then(res => JSON.parse(res))
                    .then(data => {
                        if (!data.data) {
                            createModal(`
                               <h3>Invalid Dataset</h3>
                               <p>Checkout the expected Dataset JSON format on the <a href="https://github.com/Temi-Tade/Skaylar">GitHub repository</a></p>
                            `);
                            return;
                        }
                        importDataset(data);
                        selectedDataset.textContent = `Selected Dataset:\n${data.name}`;
                    });
                }
            }
            
            [...document.querySelectorAll(".set")].forEach(s => {
                s.onclick = async function() {
                    selectedDataset.textContent = `Selected Dataset:\n${s.id}`;
                    createModal(`Loading Dataset: ${s.id}...`);
                    await fetch(`./data/${s.id}`)
                    .then(res => {
                        if (!res.ok) {
                            createModal(`An error occured while loading ${s.id}`);
                            return;
                        } else {
                            return res.json();
                        }
                    })
                    .then(data => {
                        if (!data) {
                            createModal("<h3>Invalid dataset</h3>");
                            return;
                        }
                        importDataset(data);
                    });
                }
            })
            
            return;
        }
        
        runBtn.textContent = "Running...";
        runBtn.disabled = true;
        init();
        runTest();
        
        if (isManualInput) {
            saveBtn.style.display = "inline-flex";
        } else {
            saveBtn.style.display = "none";
        }
    } catch (e) {
        console.error(e);
    }
}

runNewBtn.onclick = function() {
    history.go(0);
}

graph_menu.onclick = function() {
    createModal(`
        <h3>Graph Settings</h3>
        <ul class='menu'>
            <li>
                <span>Y-axis zoom</span>
                <select id='graph_yzoom'>
                    <option value='35'>Default</option>
                    <option value='${GRAPH_DATA.yMax}'>Fit</option>
                    <option value='50'>50%</option>
                    <option value='75'>75%</option>
                    <option value='100'>100%</option>
                </select>
            </li>
            <li>
                <span>Actual Curve</span>
                <input type="color" id="actualLabelColorPicker" value="${GRAPH_DATA.actualLabelColor}"/>
            </li>
            <li>
                <span>Expected Curve</span>
                <input type="color" id="expectedLabelColorPicker" value="${GRAPH_DATA.expectedLabelColor}"/>
            </li>
            <li>
                <span>Show Key</span>
                <label for ="key" id="slider">
                    <input type="checkbox" id="key" ${GRAPH_DATA.showLabel ? "checked" : ""}/>
                    <span id="switch"></span>
                </label>
        </ul>
    `);
    
    graph_yzoom.value = GRAPH_DATA.yZoom;
    
    graph_yzoom.onchange = function(e) {
       [...svg.childNodes].forEach(s => svg.removeChild(s))
       
       GRAPH_DATA.yZoom = e.target.value;
       plot(EXPECTED);
       plot(FREQUENCY);
    }
    
    actualLabelColorPicker.onchange = function(e) {
        GRAPH_DATA.actualLabelColor = e.target.value;
        actual_label.style.setProperty("--actual-label-color", `1.5px solid ${e.target.value}`);
        [...svg.childNodes][1].setAttribute("stroke", e.target.value);
    }
    
    expectedLabelColorPicker.onchange = function(e) {
        GRAPH_DATA.expectedLabelColor = e.target.value;
        expected_label.style.setProperty("--expected-label-color", `1.5px solid ${e.target.value}`);
        [...svg.childNodes][0].setAttribute("stroke", e.target.value)
    }
    
    key.oninput = function(e) {
        GRAPH_DATA.showLabel = e.target.checked;
        label_colors.style.display = e.target.checked ? "block" : "none";
    }
}

saveBtn.onclick = function() {
    createModal(
        saveDataset(PARAMS.externalData.join(", "))
    );
    
    saveForm.onsubmit = async function(e) {
        e.preventDefault();
        const SAVE_PARAMS = {
            name: dataset_name.value.trim(),
            description: dataset_description.value.trim(),
            source: dataset_source.value.trim(),
            data: PARAMS.externalData
        };
        
        await saveFile(JSON.stringify(SAVE_PARAMS), SAVE_PARAMS.name);
    }
}