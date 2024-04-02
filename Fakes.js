/*
 * Script Name: Mass Command Timer
 * Version: v3.1.3
 * Last Updated: 2024-03-27
 * Author: RedAlert
 * Author URL: https://twscripts.dev/
 * Author Contact: redalert_tw (Discord)
 * Approved: t14258011
 * Approved Date: 2020-10-03
 * Mod: JawJaw
 */

/*--------------------------------------------------------------------------------------
 * This script can NOT be cloned and modified without permission from the script author.
 --------------------------------------------------------------------------------------*/

// User Input
if (typeof DEBUG !== 'boolean') DEBUG = false;
if (typeof SEND_UNITS !== 'string') SEND_UNITS = '';

// Script Config
var scriptConfig = {
    scriptData: {
        prefix: 'massCommandTimer',
        name: 'Mass Command Timer',
        version: 'v3.1.3',
        author: 'RedAlert',
        authorUrl: 'https://twscripts.dev/',
        helpLink:
            'https://forum.tribalwars.net/index.php?threads/mass-command-timer.286017/',
    },
    translations: {
        en_DK: {
            'Mass Command Timer': 'Mass Command Timer',
            Help: 'Help',
            'There was an error while fetching the data!':
                'There was an error while fetching the data!',
            'There was an error fetching villages by group!':
                'There was an error fetching villages by group!',
            'An error occured while fetching troop counts!':
                'An error occured while fetching troop counts!',
            'Destination Coordinates': 'Destination Coordinates',
            'Landing Time': 'Landing Time',
            Sigil: 'Sigil',
            'Calculate Times': 'Calculate Times',
            'Export BB Code': 'Export BB Code',
            'Reset Script': 'Reset Script',
            'Open 25 First Commands': 'Open 25 First Commands',
            Randomize: 'Randomize',
            From: 'From',
            To: 'To',
            Unit: 'Unit',
            Distance: 'Distance',
            'Travel Time': 'Travel Time',
            'Launch Time': 'Launch Time',
            'Send in': 'Send in',
            Send: 'Send',
            'No possible combinations found!':
                'No possible combinations found!',
            'combinations found': 'combinations found',
            'Script was reset successfully!': 'Script was reset successfully!',
            'Copied to clipboard!': 'Copied to clipboard!',
            'This feature is not available in the UK server!':
                'This feature is not available in the UK server!',
        },
        hu_HU: {
            'Mass Command Timer': 'TÃ¡madÃ¡s szervezÅ‘',
            Help: 'SÃºgÃ³',
            'There was an error while fetching the data!':
                'Hiba tÃ¶rtÃ©nt az adatok lekÃ©rÃ©se kÃ¶zben!',
            'There was an error fetching villages by group!':
                'Hiba tÃ¶rtÃ©nt a falvak csoportonkÃ©nti lekÃ©rÃ©sekor!',
            'An error occured while fetching troop counts!':
                'Hiba tÃ¶rtÃ©nt a csapatok szÃ¡mÃ¡nak lekÃ©rÃ©se kÃ¶zben!',
            'Destination Coordinates': 'CÃ©l koordinÃ¡tÃ¡k',
            'Landing Time': 'Ã‰rkezÃ©si idÅ‘ (nap/hÃ³/Ã©v Ã³Ã³:pp:mm)',
            Sigil: 'AktÃ­v vÃ©szjelzÅ‘ %',
            'Calculate Times': 'SzÃ¡mÃ­tÃ¡s',
            'Export BB Code': 'ExportÃ¡lÃ¡s BB kÃ³dkÃ©nt',
            'Reset Script': 'Reset Script',
            'Open 25 First Commands': 'Nyissa meg az elsÅ‘ 25 parancsot',
            Randomize: 'RandomizÃ¡lÃ¡s',
            From: 'Innen',
            To: 'Ide',
            Unit: 'EgysÃ©gtÃ­pus',
            Distance: 'TÃ¡volsÃ¡g',
            'Travel Time': 'UtazÃ¡si idÅ‘',
            'Launch Time': 'Ã‰rkezÃ©si idÅ‘',
            'Send in': 'BeÃ©rkezÃ©s',
            Send: 'KÃ¼ld',
            'No possible combinations found!':
                'Nem talÃ¡lhatÃ³ megfelelÅ‘ kombinÃ¡ciÃ³!',
            'combinations found': 'TalÃ¡lt kombinÃ¡ciÃ³k',
            'Script was reset successfully!':
                'Script resetelÃ©se sikeresen vÃ©grehajtva!',
            'Copied to clipboard!': 'VÃ¡gÃ³lapra mÃ¡solva!',
            'This feature is not available in the UK server!':
                'This feature is not available in the UK server!',
        },
    },
    allowedMarkets: [],
    allowedScreens: [],
    allowedModes: [],
    isDebug: DEBUG,
    enableCountApi: true,
};

$.getScript(
    `https://twscripts.dev/scripts/twSDK.js?url=${document.currentScript.src}`,
    async function () {
        // Initialize Library
        await twSDK.init(scriptConfig);
        const scriptInfo = twSDK.scriptInfo();

        const { worldUnitInfo, villages } = await fetchWorldConfigData();

        // Entry Point
        (async function () {
            // build user interface
            buildUI();

            // register event handlers
            handleCalculateTimes();
            handleResetScript();
            handleOpenMultipleTabs();
            handleRandimize();
            handleExport();
        })();

        // Render: Build user interface
        function buildUI() {
            const { landingTime, sigil, selectedUnit, coordinates } =
                initDefaultValues();

            const unitPickerHtml = twSDK.buildUnitsPicker(
                selectedUnit,
                ['spy', 'militia'],
                'radio'
            );

            const coordinatesAmount = coordinates
                ? coordinates.split(' ').length
                : 0;

            const nonUKWorlds =
                game_data.market !== 'uk'
                    ? `<a href="javascript:void(0);" id="raOpenTabsBtn" class="btn">
                        ${twSDK.tt('Open 25 First Commands')}
                    </a>
                    <a href="javascript:void(0);" id="raRandomizeBtn" class="btn">
                        ${twSDK.tt('Randomize')}
                    </a>`
                    : '';

            const content = `
                <div class="ra-mb15 ra-grid">
                    <div>
                        <label for="raLandingTime">${twSDK.tt(
                            'Landing Time'
                        )}</label>
                        <input type="text" class="ra-input" id="raLandingTime" value="${landingTime}">
                    </div>
                    <div>
                        <label for="raSigil">${twSDK.tt('Sigil')}</label>
                        <input type="text" class="ra-input" id="raSigil" value="${sigil}">
                    </div>
                </div>
                <div class="ra-mb15">
                    ${unitPickerHtml}
                </div>
                <div class="ra-mb15">
                    <label for="raCoordinates">
                        ${twSDK.tt(
                            'Destination Coordinates'
                        )} (<span id="raCoordinatesCount">${coordinatesAmount}</span>)
                    </label>
                    <textarea class="ra-textarea" id="raCoordinates">${coordinates}</textarea>
                </div>
                <div class="ra-action-buttons">
                    <a href="javascript:void(0);" id="raCalculateTimesBtn" class="btn">
                        ${twSDK.tt('Calculate Times')}
                    </a>
                    <a href="javascript:void(0);" id="raExportBtn" class="btn" data-commands="">
                        ${twSDK.tt('Export BB Code')}
                    </a>
                    <a href="javascript:void(0);" id="raResetScriptBtn" class="btn">
                        ${twSDK.tt('Reset Script')}
                    </a>
                    ${nonUKWorlds}
                </div>
                <div id="raCommands" class="ra-mt15" style="display:none;">
                    <label><span id="raPossibleCombinationsCount">0</span> ${twSDK.tt(
                        'combinations found'
                    )}</label>
                    <div id="raPossibleCombinationsTable" class="ra-table-container"></div>
                </div>
            `;

            const customStyle = `
                .ra-grid { display: grid; grid-template-columns: 4fr 1fr; grid-gap: 15px; }
                .ra-table-v2 th { font-size: 12px; }
                .ra-table-v2 th, .ra-table-v2 td { text-align: center; border: 1px solid #c4a566; }
                .ra-table-v2 th label { cursor: pointer; }
                .ra-input { display: block; width: 100%; height: auto; padding: 5px; font-size: 14px; }
                .ra-input { padding: 5px; font-size: 16px; }
                .btn-disabled { pointer-events: none; display: none; }
                .btn-already-sent { padding: 3px; }
                .already-sent-command { opacity: 0.6; }
                @media (max-width: 480px) {
                    .ra-hide-on-mobile { display: none; }
                    .ra-action-buttons a { margin-bottom: 8px; }
                }
            `;

            twSDK.renderBoxWidget(
                content,
                scriptConfig.scriptData.prefix,
                'ra-mass-command-timer',
                customStyle
            );
        }

        // Action Handler: Calculate launch times and find possible snipes
        function handleCalculateTimes() {
            jQuery('#raCalculateTimesBtn').on('click', async function (e) {
                e.preventDefault();

                const { landingTime, sigil, selectedUnit, coordinates } =
                    collectUserInput();
                saveUserInput({
                    landingTime,
                    sigil,
                    selectedUnit,
                    coordinates,
                });

                const ownVillages = await fetchAllPlayerVillagesByGroup(
                    game_data.group_id
                );
                const troopCounts = await fetchTroopsForCurrentGroup(
                    game_data.group_id
                );

                let possibleCombinations = [];
                let realCombinations = [];

                ownVillages.forEach((village) => {
                    const { id, coords, name } = village;

                    coordinates.split(' ').forEach((coord) => {
                        const distance = twSDK.calculateDistance(coord, coords);
                        const launchTime = getLaunchTime(
                            selectedUnit,
                            landingTime,
                            distance,
                            sigil
                        );

                        if (
                            launchTime >
                                twSDK.getServerDateTimeObject().getTime() &&
                            distance > 0
                        ) {
                            const unformattedTime =
                                (landingTime.getTime() - launchTime) / 1000;
                            const travelTime =
                                twSDK.secondsToHms(unformattedTime);
                            const formattedLaunchTime =
                                twSDK.formatDateTime(launchTime);
                            possibleCombinations.push({
                                id: id,
                                name: name,
                                unit: selectedUnit,
                                fromCoord: coords,
                                toCoord: coord,
                                distance: distance,
                                launchTime: launchTime,
                                travelTime: travelTime,
                                formattedLaunchTime: formattedLaunchTime,
                                landingTime: twSDK.formatDateTime(landingTime),
                            });
                        }
                    });
                });

                possibleCombinations.sort((a, b) => {
                    return a.launchTime - b.launchTime;
                });

                possibleCombinations.forEach((combination) => {
                    const { id, unit } = combination;
                    troopCounts.forEach((villageTroops) => {
                        if (
                            villageTroops.villageId === id &&
                            villageTroops[unit] >= 1
                        ) {
                            realCombinations.push(combination);
                        }
                    });
                });

                realCombinations = realCombinations.slice(0, 500);

                if (realCombinations.length) {
                    const snipesTableHtml =
                        buildCombinationsTable(realCombinations);
                    jQuery('#raCommands').show();
                    jQuery('#raPossibleCombinationsCount').html(
                        realCombinations.length
                    );
                    jQuery('#raExportBtn').attr(
                        'data-commands',
                        JSON.stringify(realCombinations)
                    );
                    jQuery('#raPossibleCombinationsTable').html(
                        snipesTableHtml
                    );

                    jQuery(window.TribalWars)
                        .off()
                        .on('global_tick', function () {
                            const remainingTime = jQuery(
                                '#raCommands .ra-table tbody tr:eq(0) span[data-endtime]'
                            )
                                .text()
                                .trim();
                            if (remainingTime === '0:00:10') {
                                TribalWars.playSound('chat');
                            }
                            document.title =
                                twSDK.tt('Send in') + ' ' + remainingTime;
                        });

                    Timing.tickHandlers.timers.handleTimerEnd = function (e) {
                        jQuery(this).closest('tr').remove();
                    };

                    Timing.tickHandlers.timers.init();

                    handleCommandHighlight();
                } else {
                    UI.ErrorMessage(
                        twSDK.tt('No possible combinations found!')
                    );
                    jQuery('#raCommands').hide();
                    jQuery('#raExportBtn').attr('data-commands', '');
                    jQuery('#raPossibleCombinationsCount').html(0);
                    jQuery('#raPossibleCombinationsTable').html('');
                }
            });
        }

        // Action Handler: Reset script configuration
        function handleResetScript() {
            jQuery('#raResetScriptBtn').on('click', function (e) {
                e.preventDefault();

                localStorage.removeItem(
                    `${scriptConfig.scriptData.prefix}_config`
                );
                UI.SuccessMessage(twSDK.tt('Script was reset successfully!'));
                setTimeout(() => {
                    twSDK.redirectTo('overview_villages&mode=combined');
                }, 500);
            });
        }

        // Action Handler: Open multiple commands
        function handleOpenMultipleTabs() {
            jQuery('#raOpenTabsBtn').on('click', function (e) {
                e.preventDefault();

                if (game_data.market === 'uk') {
                    UI.ErrorMessage(
                        twSDK.tt(
                            'This feature is not available in the UK server!'
                        )
                    );
                    return;
                }

                jQuery('#raOpenTabsBtn').addClass('btn-disabled');

                jQuery('#combinationsTable tbody tr').each(function (
                    index,
                    row
                ) {
                    if (index < 25) {
                        setTimeout(function () {
                            const linkEl = jQuery(row).find('a.btn');
                            const linkHref = linkEl.attr('href');
                            const fullUrl = window.location.origin + linkHref;

                            if (window.CustomEvent) {
                                window.open(fullUrl, '_blank');
                            }
                            jQuery(linkEl).parent().parent().remove();
                        }, index * 200);
                    }
                    if (index === 25) {
                        jQuery('#raOpenTabsBtn').removeClass('btn-disabled');
                    }
                });
            });
        }

        // Action Handler Randomize table output
        function handleRandimize() {
            jQuery('#raRandomizeBtn').on('click', function (e) {
                e.preventDefault();

                function sortTable(elementId) {
                    let tableBody = jQuery(elementId).find('tbody');
                    let rowsCollection = jQuery(tableBody).find('tr');
                    let rows = Array.from(rowsCollection); //skip the header row

                    shuffleArray(rows);

                    for (const row of rows) {
                        tableBody.append(row);
                    }
                }

                sortTable('#combinationsTable');
            });
        }

        // Action Handler: Highlight Opened Commands
        function handleCommandHighlight() {
            jQuery('.btn-cmd-send').on('click', function () {
                jQuery(this).addClass('btn-confirm-yes btn-already-sent');
                jQuery(this).parent().parent().addClass('already-sent-command');
            });
        }

        // Action Handler: Export commands as BB code
        function handleExport() {
            jQuery('#raExportBtn').on('click', function (e) {
                e.preventDefault();

                let commands =
                    JSON.parse(jQuery(this).attr('data-commands')) ?? [];
                commands = commands.slice(0, 200);
                console.log(commands);
                const bbCodeExport = getBBCodeExport(commands);

                twSDK.copyToClipboard(bbCodeExport);
                UI.SuccessMessage(twSDK.tt('Copied to clipboard!'));
            });
        }

        // Helper: Get BB Code export for snipe attempts
        function getBBCodeExport(commands) {
            let bbCode = `[table]`;

            commands.forEach((command) => {
                const { id, fromCoord, toCoord, formattedLaunchTime, unit } =
                    command;
                const [toX, toY] = toCoord.split('|');

                let sitterId =
                    game_data.sitter > 0 ? `t=${game_data.player.id}` : '';
                let fillRallyPoint =
                    game_data.market !== 'uk'
                        ? `&x=${toX}&y=${toY}${SEND_UNITS}`
                        : '';

                let commandUrl = `/game.php?${sitterId}&village=${id}&screen=place${fillRallyPoint}`;

                bbCode += `[*][unit]${unit}[/unit] [|] ${fromCoord} -> ${toCoord} [|]${formattedLaunchTime}[|][url=${
                    window.location.origin
                }${commandUrl}]${twSDK.tt('Send')}[/url][|]\n`;
            });

            bbCode += `[/table]`;

            return bbCode;
        }

        // Helper: Render Combinations Table
        function buildCombinationsTable(snipes) {
            let combinationsTable = `
                <table class="ra-table ra-table-v2" width="100%" id="combinationsTable">
                    <thead>
                        <tr>
                            <th class="ra-hide-on-mobile">
                                #
                            </th>
                            <th class="ra-text-left">
                                ${twSDK.tt('From')}
                            </th>
                            <th class="ra-text-left">
                                ${twSDK.tt('To')}
                            </th>
                            <th class="ra-hide-on-mobile">
                                ${twSDK.tt('Distance')}
                            </th>
                            <th class="ra-hide-on-mobile">
                                ${twSDK.tt('Travel Time')}
                            </th>
                            <th>
                                ${twSDK.tt('Launch Time')}
                            </th>
                            <th>
                                ${twSDK.tt('Send in')}
                            </th>
                            <th>
                                ${twSDK.tt('Send')}
                            </th>
                        </tr>
                    </thead>
                <tbody>
            `;

            const serverTime = twSDK.getServerDateTimeObject().getTime();

            snipes.forEach((snipe, index) => {
                const {
                    id,
                    fromCoord,
                    toCoord,
                    distance,
                    launchTime,
                    travelTime,
                    formattedLaunchTime,
                } = snipe;
                const [toX, toY] = toCoord.split('|');
                const timeTillLaunch = twSDK.secondsToHms(
                    (launchTime - serverTime) / 1000
                );

                const toCoordData = villages.find(
                    (village) => village[2] + '|' + village[3] === toCoord
                );

                if (!toCoordData) return;

                let sitterId =
                    game_data.sitter > 0 ? `t=${game_data.player.id}` : '';
                let fillRallyPoint =
                    game_data.market !== 'uk'
                        ? `&x=${toX}&y=${toY}${SEND_UNITS}`
                        : '';

                let commandUrl = `/game.php?${sitterId}&village=${id}&screen=place${fillRallyPoint}`;

                combinationsTable += `
                    <tr>
                        <td class="ra-hide-on-mobile">
                            ${index + 1}
                        </td>
                        <td class="ra-text-left">
                            <a href="${
                                game_data.link_base_pure
                            }info_village&id=${id}" target="_blank" rel="noopener noreferrer">
                                ${fromCoord}
                            </a>
                        </td>
                        <td>
                            <a href="${
                                game_data.link_base_pure
                            }info_village&id=${
                    toCoordData[0]
                }" target="_blank" rel="noopener noreferrer">
                                ${toCoord}
                            </a>
                        </td>
                        <td class="ra-hide-on-mobile">
                            ${parseFloat(distance).toFixed(2)}
                        </td>
                        <td class="ra-hide-on-mobile">
                            ${travelTime}
                        </td>
                        <td>
                            ${formattedLaunchTime}
                        </td>
                        <td>
                            <span class="timer" data-endtime>${timeTillLaunch}</span>
                        </td>
                        <td>
                            <a href="${commandUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-cmd-send">
                                ${twSDK.tt('Send')}
                            </a>
                        </td>
                    </tr>
                `;
            });

            combinationsTable += `</tbody></table>`;

            return combinationsTable;
        }

        // Helper: Get landing time date object
        function getLandingTime(landingTime) {
            const [landingDay, landingHour] = landingTime.split(' ');
            const [day, month, year] = landingDay.split('/');
            const landingTimeFormatted = `${year}-${month}-${day} ${landingHour}`;
            const landingTimeObject = new Date(landingTimeFormatted);
            return landingTimeObject;
        }

        // Helper: Get launch time of command
        function getLaunchTime(unit, landingTime, distance, sigil) {
            const msPerSec = 1000;
            const secsPerMin = 60;
            const msPerMin = msPerSec * secsPerMin;
            const sigilRatio = 1 + sigil / 100;

            const unitSpeed = worldUnitInfo.config[unit].speed;
            const unitTime = (distance * unitSpeed * msPerMin) / sigilRatio;

            const launchTime = new Date();
            launchTime.setTime(
                Math.round((landingTime - unitTime) / msPerSec) * msPerSec
            );

            return launchTime.getTime();
        }

        // Helper: Get the default field values on script load time
        function initDefaultValues() {
            const config =
                JSON.parse(
                    localStorage.getItem(
                        `${scriptConfig.scriptData.prefix}_config`
                    )
                ) ?? {};

            return {
                landingTime: config.landingTime
                    ? new Date(config.landingTime)
                          .toLocaleString('en-GB')
                          .replace(',', '')
                    : new Date().toLocaleString('en-GB').replace(',', ''),
                sigil: config.sigil ?? 0,
                selectedUnit: config.selectedUnit ?? 'ram',
                coordinates: config.coordinates ?? '',
            };
        }

        // Helper: Collect user input
        function collectUserInput() {
            const landingTime = jQuery('#raLandingTime').val();
            const targetCoordinatesArray = jQuery('#raCoordinates')
                .val()
                .match(twSDK.coordsRegex);
            const sigil = parseInt(jQuery('#raSigil').val()) ?? 0;

            const landingTimeObject = getLandingTime(landingTime);
            const selectedUnit = jQuery(
                'input[name="ra_chosen_units"]:checked'
            ).val();

            const targetCoordinates = targetCoordinatesArray.join(' ');
            jQuery('#raCoordinates').val(targetCoordinates);
            jQuery('#raCoordinatesCount').html(targetCoordinatesArray.length);

            return {
                landingTime: landingTimeObject,
                sigil,
                selectedUnit,
                coordinates: targetCoordinates,
            };
        }

        // Helper: Save user input in memory
        function saveUserInput(userInput) {
            localStorage.setItem(
                `${scriptConfig.scriptData.prefix}_config`,
                JSON.stringify(userInput)
            );
        }

        // Helper: Fetch home troop counts for current group
        async function fetchTroopsForCurrentGroup(groupId) {
            const mobileCheck = $('#mobileHeader').length > 0;
            const troopsForGroup = await jQuery
                .get(
                    game_data.link_base_pure +
                        `overview_villages&mode=combined&group=${groupId}&page=-1`
                )
                .then(async (response) => {
                    const htmlDoc = jQuery.parseHTML(response);
                    const homeTroops = [];

                    if (mobileCheck) {
                        let table = jQuery(htmlDoc).find(
                            '#combined_table tr.nowrap'
                        );
                        for (let i = 0; i < table.length; i++) {
                            let objTroops = {};
                            let villageId = parseInt(
                                table[i]
                                    .getElementsByClassName('quickedit-vn')[0]
                                    .getAttribute('data-id')
                            );
                            let listTroops = Array.from(
                                table[i].getElementsByTagName('img')
                            )
                                .filter((e) => e.src.includes('unit'))
                                .map((e) => ({
                                    name: e.src
                                        .split('unit_')[1]
                                        .replace('@2x.png', ''),
                                    value: parseInt(
                                        e.parentElement.nextElementSibling
                                            .innerText
                                    ),
                                }));
                            listTroops.forEach((item) => {
                                objTroops[item.name] = item.value;
                            });

                            objTroops.villageId = villageId;

                            homeTroops.push(objTroops);
                        }
                    } else {
                        const combinedTableRows = jQuery(htmlDoc).find(
                            '#combined_table tr.nowrap'
                        );
                        const combinedTableHead = jQuery(htmlDoc).find(
                            '#combined_table tr:eq(0) th'
                        );

                        const combinedTableHeader = [];

                        // collect possible buildings and troop types
                        jQuery(combinedTableHead).each(function () {
                            const thImage = jQuery(this)
                                .find('img')
                                .attr('src');
                            if (thImage) {
                                let thImageFilename = thImage.split('/').pop();
                                thImageFilename = thImageFilename.replace(
                                    '.png',
                                    ''
                                );
                                combinedTableHeader.push(thImageFilename);
                            } else {
                                combinedTableHeader.push(null);
                            }
                        });

                        // collect possible troop types
                        combinedTableRows.each(function () {
                            let rowTroops = {};

                            combinedTableHeader.forEach(
                                (tableHeader, index) => {
                                    if (tableHeader) {
                                        if (tableHeader.includes('unit_')) {
                                            const villageId = jQuery(this)
                                                .find(
                                                    'td:eq(1) span.quickedit-vn'
                                                )
                                                .attr('data-id');
                                            const unitType =
                                                tableHeader.replace(
                                                    'unit_',
                                                    ''
                                                );
                                            rowTroops = {
                                                ...rowTroops,
                                                villageId: parseInt(villageId),
                                                [unitType]: parseInt(
                                                    jQuery(this)
                                                        .find(`td:eq(${index})`)
                                                        .text()
                                                ),
                                            };
                                        }
                                    }
                                }
                            );

                            homeTroops.push(rowTroops);
                        });
                    }

                    return homeTroops;
                })
                .catch((error) => {
                    UI.ErrorMessage(
                        tt('An error occured while fetching troop counts!')
                    );
                    console.error(`${scriptInfo()} Error:`, error);
                });

            return troopsForGroup;
        }

        // Helper: Fetch player villages by group
        async function fetchAllPlayerVillagesByGroup(groupId) {
            try {
                let fetchVillagesUrl = '';
                if (game_data.player.sitter > 0) {
                    fetchVillagesUrl =
                        game_data.link_base_pure +
                        `groups&ajax=load_villages_from_group&t=${game_data.player.id}`;
                } else {
                    fetchVillagesUrl =
                        game_data.link_base_pure +
                        'groups&ajax=load_villages_from_group';
                }
                const villagesByGroup = await jQuery
                    .post({
                        url: fetchVillagesUrl,
                        data: { group_id: groupId },
                        dataType: 'json',
                        headers: { 'TribalWars-Ajax': 1 },
                    })
                    .then(({ response }) => {
                        const parser = new DOMParser();
                        const htmlDoc = parser.parseFromString(
                            response.html,
                            'text/html'
                        );
                        const tableRows = jQuery(htmlDoc)
                            .find('#group_table > tbody > tr')
                            .not(':eq(0)');

                        if (tableRows.length) {
                            let villagesList = [];

                            tableRows.each(function () {
                                const villageId =
                                    jQuery(this)
                                        .find('td:eq(0) a')
                                        .attr('data-village-id') ??
                                    jQuery(this)
                                        .find('td:eq(0) a')
                                        .attr('href')
                                        .match(/\d+/)[0];
                                const villageName = jQuery(this)
                                    .find('td:eq(0)')
                                    .text()
                                    .trim();
                                const villageCoords = jQuery(this)
                                    .find('td:eq(1)')
                                    .text()
                                    .trim();

                                villagesList.push({
                                    id: parseInt(villageId),
                                    name: villageName,
                                    coords: villageCoords,
                                });
                            });

                            return villagesList;
                        } else {
                            return [];
                        }
                    });

                return villagesByGroup;
            } catch (error) {
                UI.ErrorMessage(
                    twSDK.tt('There was an error fetching villages by group!')
                );
                console.error(`${scriptInfo} Error:`, error);
            }
        }

        /**
         * Randomize array element order in-place.
         * Using Durstenfeld shuffle algorithm.
         * from: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array/12646864#12646864
         */
        function shuffleArray(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }

        // Service: Fetch world config and needed data
        async function fetchWorldConfigData() {
            try {
                const worldUnitInfo = await twSDK.getWorldUnitInfo();
                const villages = await twSDK.worldDataAPI('village');
                return { villages, worldUnitInfo };
            } catch (error) {
                UI.ErrorMessage(
                    twSDK.tt('There was an error while fetching the data!')
                );
                console.error(`${scriptInfo} Error:`, error);
            }
        }
    }
);
