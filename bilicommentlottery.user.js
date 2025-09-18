// ==UserScript==
// @name         BiliCommentLottery
// @namespace    BiliCommentLottery
// @version      1.0.9
// @description  B站评论区抽奖（非官方）
// @author       InJeCTrL
// @match        https://*.bilibili.com/opus/*
// @match        https://t.bilibili.com/*
// @match        https://m.bilibili.com/dynamic/*
// @match        https://*.bilibili.com/video/*
// @match        https://*.bilibili.com/read/*
// @exclude      https://t.bilibili.com/
// @exclude      https://t.bilibili.com/?*
// @grant        none
// @updateURL    https://github.com/InJeCTrL/BiliCLMonkey/releases/download/latest/bilicommentlottery.user.js
// @downloadURL  https://github.com/InJeCTrL/BiliCLMonkey/releases/download/latest/bilicommentlottery.user.js
// @require      https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.js
// @require      https://unpkg.com/xhook@latest/dist/xhook.min.js
// @run-at       document-body
// ==/UserScript==

(function() {
    'use strict';

    const isDebug = 0;

    // 加载flatpickr CSS
    const flatpickrStylelLink = document.createElement('link');
    flatpickrStylelLink.rel = 'stylesheet';
    flatpickrStylelLink.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
    document.head.appendChild(flatpickrStylelLink);

    // 唤起BCL按钮
    const bclButton = document.createElement('button');
    bclButton.textContent = '评论区抽奖';
    bclButton.style.position = 'fixed';
    bclButton.style.fontWeight = 'bold';
    bclButton.style.fontSize = '14px';
    bclButton.style.bottom = '20px';
    bclButton.style.left = '20px';
    bclButton.style.padding = '10px 20px';
    bclButton.style.backgroundColor = '#2B88F0';
    bclButton.style.color = 'white';
    bclButton.style.border = 'none';
    bclButton.style.borderRadius = '5px';
    bclButton.style.cursor = 'pointer';
    bclButton.style.zIndex = '10000';
    document.body.appendChild(bclButton);

    // 抽奖遮罩
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = '#3690F4';
    overlay.style.color = 'white';
    overlay.style.zIndex = isDebug === 1 ? '0' : '999999';
    overlay.style.display = 'none';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.overflow = 'auto';
    overlay.style.padding = '20px';
    overlay.style.boxSizing = 'border-box';
    overlay.style.fontSize = '15px';
    overlay.style.fontWeight = 'bold';
    document.body.appendChild(overlay);

    // 顶部标题
    const title = document.createElement('h1');
    title.textContent = 'B站评论区抽奖（BiliCommentLottery）';
    title.style.color = 'white';
    title.style.fontFamily = 'PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif !important';
    title.style.fontWeight = '400';
    title.style.fontSize = '32px';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '5px';
    title.style.textAlign = 'center';
    overlay.appendChild(title);

    // Github跳转
    const projectContainer = document.createElement('div');
    projectContainer.style.display = 'flex';
    projectContainer.style.alignItems = 'center';
    projectContainer.style.justifyContent = 'center';
    projectContainer.style.margin = 'auto';
    projectContainer.style.width = 'fit-content';

    const projectPage = document.createElement('a');
    projectPage.style.color = 'white';
    projectPage.style.marginBottom = '20px';
    projectPage.href = 'https://github.com/InJeCTrL/BiliCLMonkey';
    projectPage.target = '_blank';
    projectPage.style.display = 'flex';
    projectPage.style.alignItems = 'center';

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, 'svg');
    svg.style.paddingRight = '5px';
    svg.setAttribute('height', '32');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('version', '1.1');
    svg.setAttribute('width', '32');

    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', 'M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z');
    svg.appendChild(path);

    const text = document.createTextNode('InJeCTrL/BiliCLMonkey');
    projectPage.appendChild(svg);
    projectPage.appendChild(text);
    projectContainer.appendChild(projectPage);
    overlay.appendChild(projectContainer);

    // 获取评论状态
    const loadingText = document.createElement('div');
    loadingText.textContent = '正在获取评论...';
    loadingText.style.marginBottom = '10px';
    loadingText.style.width = '100%';
    loadingText.style.textAlign = 'center';
    overlay.appendChild(loadingText);

    // 获取评论进度条
    const progressBar = document.createElement('div');
    progressBar.style.width = '0%';
    progressBar.style.backgroundColor = '#66B14A';
    progressBar.style.height = '30px';
    progressBar.style.textAlign = 'center';
    progressBar.style.lineHeight = '30px';
    progressBar.style.color = 'white';
    progressBar.style.margin = '0px auto'
    overlay.appendChild(progressBar);

    // 抽奖选项
    const form = document.createElement('form');
    form.style.backgroundColor = 'rgb(238, 238, 238, 0.6)';
    form.style.color = 'black';
    form.style.padding = '10px';
    form.style.marginTop = '10px';
    form.style.display = 'none'; // 初始隐藏
    overlay.appendChild(form);

    // 揭晓所有中奖者按钮
    const revealAllButton = document.createElement('button');
    revealAllButton.textContent = '揭晓所有中奖者';
    revealAllButton.style.borderRadius = '3px';
    revealAllButton.style.backgroundColor = '#66B14A';
    revealAllButton.style.fontSize = '16px';
    revealAllButton.style.color = 'white';
    revealAllButton.style.width = '100%';
    revealAllButton.style.border = 'none';
    revealAllButton.style.padding = '10px 20px';
    revealAllButton.style.marginTop = '10px';
    revealAllButton.style.cursor = 'pointer';
    revealAllButton.style.display = 'none'; // 初始隐藏
    revealAllButton.onclick = () => {
        document.querySelectorAll('.winner-list tr').forEach(row => {
            row.querySelector('.info-mask').click();
        });
    };
    overlay.appendChild(revealAllButton);

    // 中奖展示
    const winnerList = document.createElement('table');
    winnerList.classList.add('winner-list');
    overlay.appendChild(winnerList);

    function createFormField(labelText, inputType, name, options, width) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'row';
        container.style.alignItems = 'center';
        container.style.marginBottom = '10px';
        container.style.width = width;

        const label = document.createElement('label');
        label.textContent = labelText;
        label.htmlFor = name;
        label.style.marginRight = '10px';
        container.appendChild(label);

        if (inputType === 'checkbox') {
            const checkbox = document.createElement('input');
            checkbox.type = inputType;
            checkbox.name = name;
            checkbox.value = options.value;
            checkbox.checked = options.checked;
            container.appendChild(checkbox);
        } else if (inputType === 'datetime-local') {
            const input = document.createElement('input');
            input.type = 'text';
            input.name = name;
            input.placeholder = '点击选择日期时间';
            input.style.width = '60%';
            if (options && options.defaultValue !== undefined) {
                input.value = options.defaultValue;
            }
            container.appendChild(input);

            const flatpickrInstance = flatpickr(input, {
                enableTime: true,
                dateFormat: "Y-m-d H:i",
                time_24hr: true,
            });
            flatpickrInstance.calendarContainer.style.zIndex = '9999999';
        } else {
            const input = document.createElement('input');
            input.type = inputType;
            input.name = name;
            if (name === 'keyword') {
                input.style.width = '80%';
            }
            if (inputType === 'number') {
                input.min = 1;
                input.max = allReplies.length;
                input.step = 1;
                input.style.width = '60%';
            }
            if (options && options.defaultValue !== undefined) {
                input.value = options.defaultValue;
            }
            container.appendChild(input);
        }

        return container;
    }

    // 检测到评论获取失败之后设置的冻结时间
    let freezeTime = 45000;
    // 获取评论的额外间隔时间
    let paddingTime = 0;

    function rollAndFetchComments() {
        window.scroll(0, 0);
        // 0.5s 后滚动到底
        setTimeout(function(){
            window.scroll(0, document.body.scrollHeight);
        }, 500);
        let biliComments = document.getElementsByTagName('bili-comments');
        if (biliComments != null && biliComments.length >= 1) {
            // 切换到最新评论列表
            let header = biliComments[0].shadowRoot.querySelector('#header');
            if (header != null) {
                header.querySelector('bili-comments-header-renderer').shadowRoot.querySelectorAll('bili-text-button').forEach(btn => {
                    if (btn.innerText === '最新') btn.click();
                });
            }

            // 移除具体评论块
            let contents = biliComments[0].shadowRoot.querySelector('#contents');
            if (contents != null) {
                contents.remove();
            }

            // 判断结束
            let end = biliComments[0].shadowRoot.querySelector('#end');
            if (end != null && end.innerText == '没有更多评论') {
                return;
            }
        }

        // 2s - 10s 后再次执行
        setTimeout(rollAndFetchComments, paddingTime + Math.random() * 8000 + 2000);
    }

    function openLotteryPanel() {
        overlay.style.display = 'block';
        bclButton.style.display = 'none';

        // 隐藏右侧栏
        document.body.querySelectorAll('.right-container').forEach(element => {
            element.style.display = 'none';
        });

        // 隐藏滚动条
        document.body.style.overflow = 'hidden';

        window.scroll(0, document.body.scrollHeight);

        setTimeout(rollAndFetchComments, 500);
    }

    bclButton.addEventListener('click', function() {
        openLotteryPanel();
    });

    let allReplies = [];
    let realEnd = false;
    let totalReplies = 1;
    const addReplyIdSet = new Set();

    xhook.after(function(request, response) {
        if (realEnd) return;
        if (request.url.includes('api.bilibili.com') && request.url.includes('/reply/')) {
            let resData = response.clone().json();
            resData.then(res => {
                if (res == null || res.data == null || res.data.cursor == null) return;
                let replies = [...res.data.replies, ...res.data.top_replies];
                totalReplies = Math.max(totalReplies, res.data.cursor.prev);

                replies.forEach(reply => {
                    const rpid = reply.rpid;
                    if (!addReplyIdSet.has(rpid)) {
                        addReplyIdSet.add(rpid);
                        allReplies.push({
                            mid: reply.member.mid,
                            uname: reply.member.uname,
                            current_level: reply.member.level_info.current_level,
                            avatar: reply.member.avatar,
                            rpid: rpid,
                            message: reply.content.message,
                            ctime: reply.ctime
                        });
                    }
                });

                let percentComplete = (allReplies.length / totalReplies * 100).toFixed(2);
                if (percentComplete >= 100 || res.data.cursor.is_end) percentComplete = 100;
                progressBar.textContent = `${percentComplete}%`;
                progressBar.style.width = `${percentComplete}%`;

                if (res.data.cursor.is_end) {
                    realEnd = true;
                    percentComplete = 100;
                    allReplies.sort((x, y) => {
                        return x.ctime - y.ctime;
                    });
                    displayRepliesInTable(allReplies, allReplies.length);
                    loadingText.style.display = 'none';
                    showFilterForm();
                }

                loadingText.textContent = '正在获取评论...';
                progressBar.style.backgroundColor = '#66B14A';
                paddingTime = 0;
            }).catch((error) => {
                console.error('Error processing response:', error);
                loadingText.textContent = '部分评论获取失败，仍在尝试加载（慢速）';
                progressBar.style.backgroundColor = '#F78F33';
                paddingTime = freezeTime;
            });
        }
    });

    function formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    function generateCSVContent(replies) {
        const headers = ['用户昵称', '用户UID', '用户等级', '评论内容', '发布时间'];
        const rows = replies.map(reply => [
            reply.uname,
            reply.mid,
            `LV${reply.current_level}`,
            reply.message,
            formatTime(reply.ctime),
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(item => `"${item.replace(/"/g, '""')}"`).join(',')),
        ].join('\n');

        return '\uFEFF' + csvContent;
    }

    function displayRepliesInTable(replies, totalReplies) {
        // 总条数和评论下载
        const infoContainer = document.createElement('div');
        infoContainer.classList.add('total-replies-info');
        infoContainer.style.display = 'flex';
        infoContainer.style.justifyContent = 'space-between';
        infoContainer.style.alignItems = 'center';
        infoContainer.style.marginTop= '20px';
        infoContainer.style.width = '100%';

        const existingTotalRepliesInfo = overlay.querySelector('.total-replies-info');
        if (existingTotalRepliesInfo) {
            existingTotalRepliesInfo.replaceWith(infoContainer);
        } else {
            overlay.appendChild(infoContainer);
        }

        // 评论表格
        const table = document.createElement('table');
        table.classList.add('all-replies-tbl');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        table.style.marginTop = '10px';

        const existingTotalRepliesTbl = overlay.querySelector('.all-replies-tbl');
        if (existingTotalRepliesTbl) {
            existingTotalRepliesTbl.replaceWith(table);
        } else {
            overlay.appendChild(table);
        }

        // 显示总条数
        const totalRepliesText = document.createElement('div');
        totalRepliesText.textContent = `共获取到 ${totalReplies} 条评论`;
        totalRepliesText.style.fontWeight = 'bold';
        totalRepliesText.style.fontSize = '17px';
        infoContainer.appendChild(totalRepliesText);

        // 下载所有评论数据
        const downloadButton = document.createElement('button');
        downloadButton.textContent = '下载所有评论数据';
        downloadButton.style.backgroundColor = '#66B14A';
        downloadButton.style.color = 'white';
        downloadButton.style.border = 'none';
        downloadButton.style.padding = '5px 10px';
        downloadButton.style.borderRadius = '3px';
        downloadButton.style.cursor = 'pointer';
        downloadButton.onclick = () => downloadTableData(replies);
        infoContainer.appendChild(downloadButton);

        // 创建表头
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['用户昵称 [UID]', '用户等级', '评论内容', '发布时间'].forEach(headerText => {
            const header = document.createElement('th');
            header.textContent = headerText;
            header.style.padding = '8px';
            header.style.textAlign = 'left';
            header.style.border = '1px solid white';
            header.style.fontWeight = 'bold';
            headerRow.appendChild(header);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // 创建表格内容
        const tbody = document.createElement('tbody');
        replies.forEach(reply => {
            const row = document.createElement('tr');

            // 用户昵称列
            const unameCell = document.createElement('td');
            const unameLink = document.createElement('a');
            unameLink.href = `https://space.bilibili.com/${reply.mid}`;
            unameLink.target = '_blank';
            unameLink.style.color = 'white';
            unameLink.style.textDecoration = 'underline';
            unameLink.textContent = `${reply.uname} [${reply.mid}]`;
            unameCell.style.border = '1px solid white';
            unameCell.appendChild(unameLink);
            row.appendChild(unameCell);

            // 用户等级列
            const levelCell = document.createElement('td');
            levelCell.textContent = `LV${reply.current_level}`;
            levelCell.style.border = '1px solid white';
            row.appendChild(levelCell);

            // 评论内容列
            const messageCell = document.createElement('td');
            const messageLink = document.createElement('a');
            let currentLink = window.location.href;
            const replyIndex = currentLink.indexOf('#reply');
            if (replyIndex !== -1) {
                currentLink = currentLink.substring(0, replyIndex);
            }
            messageLink.href = `${currentLink}#reply${reply.rpid}`;
            messageLink.target = '_blank';
            messageLink.style.color = 'white';
            messageLink.style.textDecoration = 'underline';
            messageLink.textContent = reply.message.slice(0, 20) + (reply.message.length > 20 ? '...' : '');
            messageCell.style.border = '1px solid white';
            messageCell.appendChild(messageLink);
            row.appendChild(messageCell);

            // 发布时间列
            const timeCell = document.createElement('td');
            timeCell.textContent = formatTime(reply.ctime);
            timeCell.style.border = '1px solid white';
            row.appendChild(timeCell);

            tbody.appendChild(row);
        });
        table.appendChild(tbody);
    }

    function downloadTableData(replies) {
        if (window.Worker) {
            // 支持Web Worker
            const workerCode = `
                self.onmessage = function(e) {
                    const replies = e.data;
                    const csvContent = (${generateCSVContent.toString()})(replies);
                    self.postMessage(csvContent);
                };

                ${formatTime.toString()}
            `;
            const blob = new Blob([workerCode], { type: 'application/javascript' });
            const workerUrl = URL.createObjectURL(blob);

            const worker = new Worker(workerUrl);

            worker.postMessage(replies);

            worker.onmessage = function(e) {
                finalizeDownload(e.data);
            };
        } else {
            // 不支持Web Worker
            const csvContent = generateCsvContent(replies);
            finalizeDownload(csvContent);
        }
    }

    function finalizeDownload(csvContent) {
        const urlSlices = window.location.href.split('?')[0].split('#')[0].replaceAll('/', ' ').trim().split(' ');
        const downloadFilename = `${urlSlices[urlSlices.length - 1]}-${parseInt(new Date().getTime() / 1000, 10)}.csv`;
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = downloadFilename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    function showFilterForm() {
        form.innerHTML = '';
        form.style.display = 'block';

        // 中奖人数和用户去重
        const winnersCountContainer = createFormField('中奖人数', 'number', 'winnersCount', {defaultValue: 1}, '50%');
        const uniqueUsersContainer = createFormField('按用户去重', 'checkbox', 'uniqueUsers', {checked: true}, '50%');
        const firstRow = document.createElement('div');
        firstRow.style.display = 'flex';
        firstRow.style.justifyContent = 'space-between';
        firstRow.appendChild(winnersCountContainer);
        firstRow.appendChild(uniqueUsersContainer);
        form.appendChild(firstRow);

        // 起止时间范围
        const startTimeContainer = createFormField('起始时间', 'datetime-local', 'startTime', null, '50%');
        const endTimeContainer = createFormField('结束时间', 'datetime-local', 'endTime', null, '50%');
        const secondRow = document.createElement('div');
        secondRow.style.display = 'flex';
        secondRow.style.justifyContent = 'space-between';
        secondRow.appendChild(startTimeContainer);
        secondRow.appendChild(endTimeContainer);
        form.appendChild(secondRow);

        // 用户等级
        const levelsContainer = document.createElement('div');
        levelsContainer.style.marginBottom = '10px';
        const levelsLabel = document.createElement('label');
        levelsLabel.textContent = '用户等级';
        levelsLabel.style.marginRight = '10px';
        levelsContainer.appendChild(levelsLabel);
        Array.from({length: 7}, (_, i) => ({
            value: i,
            checked: i > 0 && i <= 6
        })).forEach(option => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'levels';
            checkbox.value = option.value;
            checkbox.checked = option.checked;
            const label = document.createElement('label');
            label.textContent = `LV${option.value}`;
            label.style.marginRight = '10px';
            levelsContainer.appendChild(checkbox);
            levelsContainer.appendChild(label);
        });
        form.appendChild(levelsContainer);

        // 关键字
        const keywordContainer = createFormField('评论关键字', 'text', 'keyword', '80%');
        form.appendChild(keywordContainer);

        // 执行抽奖
        const submitButton = document.createElement('button');
        submitButton.type = 'button';
        submitButton.textContent = '开始抽奖';
        submitButton.style.marginTop = '20px';
        submitButton.style.width = '100%';
        submitButton.style.padding = '10px 20px';
        submitButton.style.backgroundColor = '#FF4500';
        submitButton.style.color = 'white';
        submitButton.style.border = 'none';
        submitButton.style.borderRadius = '5px';
        submitButton.style.cursor = 'pointer';
        submitButton.onclick = () => generateWinnersList();
        form.appendChild(submitButton);
    }

    function filterRepliesByConditions(replies) {
        const formData = new FormData(form);
        const uniqueUsers = formData.get('uniqueUsers') !== null;
        const startTime = form.querySelector('input[name="startTime"]').value ? new Date(form.querySelector('input[name="startTime"]').value).getTime() / 1000 : 0;
        const endTime = form.querySelector('input[name="endTime"]').value ? new Date(form.querySelector('input[name="endTime"]').value).getTime() / 1000 : Infinity;
        const selectedLevels = formData.getAll('levels').map(level => parseInt(level, 10));
        const keyword = formData.get('keyword').trim().toLowerCase();

        return replies.filter(reply => {
            const isWithinTimeRange = reply.ctime >= startTime && reply.ctime <= endTime;
            const matchesLevel = selectedLevels.includes(reply.current_level);
            const containsKeyword = keyword === '' || reply.message.toLowerCase().includes(keyword);
            return isWithinTimeRange && matchesLevel && containsKeyword;
        }).filter((reply, index, self) =>
                  !uniqueUsers || self.findIndex(t => t.mid === reply.mid) === index
                 );
    }

    function getRandomWinners(filteredReplies, count) {
        const shuffledReplies = filteredReplies.slice();
        const winnerReplies = [];

        for (let i = 0; i < count; i++) {
            const j = Math.floor(Math.random() * (shuffledReplies.length - i));
            winnerReplies.push(shuffledReplies[j]);
            [shuffledReplies[j], shuffledReplies[shuffledReplies.length - i - 1]] = [shuffledReplies[shuffledReplies.length - i - 1], shuffledReplies[j]];
        }

        return winnerReplies;
    }

    function setIsFans(isFollowerCell, mid) {
        const reloadButton = document.createElement('button');
        reloadButton.textContent = '重新获取';
        reloadButton.style.backgroundColor = '#eb5528';
        reloadButton.style.color = 'white';
        reloadButton.style.border = 'none';
        reloadButton.style.padding = '2px 5px';
        reloadButton.style.borderRadius = '3px';
        reloadButton.style.cursor = 'pointer';

        reloadButton.onclick = () => {
            isFollowerCell.innerHTML = '';
            isFollowerCell.appendChild(reloadButton);
            setIsFans(isFollowerCell, mid);
        };

        fetch(`https://api.bilibili.com/x/space/acc/relation?mid=${mid}`, { credentials: 'include' })
            .then(response => response.json())
            .then(data => {
            if (data.data == null || data.data.be_relation == null) {
                isFollowerCell.innerHTML = '';
                isFollowerCell.appendChild(reloadButton);
                return;
            }
            if (data.data.be_relation.attribute > 0) {
                isFollowerCell.innerHTML = '<span style="font-size: 15px; background-color: green; color: white; padding: 2px 5px; border-radius: 3px;">粉丝</span>';
            } else {
                isFollowerCell.innerHTML = '<span style="font-size: 15px; background-color: orange; color: white; padding: 2px 5px; border-radius: 3px;">非粉丝</span>';
            }
        }).catch(error => {
            console.error('Error:', error);
            isFollowerCell.innerHTML = '';
            isFollowerCell.appendChild(reloadButton);
        });
    }

    function generateWinnersList() {
        const filteredReplies = filterRepliesByConditions(allReplies);
        if (filteredReplies.length === 0) {
            alert('没有符合条件的评论可以参与抽奖');
            return;
        }

        const formData = new FormData(form);
        const winnersCount = parseInt(formData.get('winnersCount'), 10);
        if (isNaN(winnersCount) || winnersCount <= 0) {
            alert('无效的中奖人数');
            return;
        }
        if (winnersCount > filteredReplies.length) {
            alert('预定中奖人数超过符合条件的评论数');
            return;
        }

        revealAllButton.style.display = 'block';

        const winners = getRandomWinners(filteredReplies, winnersCount);

        // 中奖栏
        const winnerTable = document.createElement('table');
        winnerTable.style.marginTop = '10px';
        winnerTable.style.width = '100%';
        winnerTable.style.borderCollapse = 'separate';
        winnerTable.style.borderSpacing = '0px 10px';

        // 中奖栏内容
        const tbody = document.createElement('tbody');
        winners.forEach(reply => {
            const row = document.createElement('tr');
            row.style.position = 'relative';
            row.style.backgroundColor = '#67ad5b';

            // 用户信息单元（包含头像、昵称[UID]、等级、时间、评论）
            const userInfoCell = document.createElement('td');
            userInfoCell.style.display = 'flex';
            userInfoCell.style.alignItems = 'flex-start';

            // 用户头像
            const avatarDiv = document.createElement('div');
            const avatarImg = document.createElement('img');
            avatarImg.src = reply.avatar;
            avatarImg.style.maxWidth = '50px';
            avatarImg.style.maxHeight = '50px';
            avatarDiv.appendChild(avatarImg);
            userInfoCell.appendChild(avatarDiv);

            // 用户详细信息（昵称[UID]、等级、发布时间）
            const detailDiv = document.createElement('div');
            detailDiv.style.marginLeft = '10px';

            const userInfoRow = document.createElement('div');
            userInfoRow.style.display = 'flex';
            userInfoRow.style.alignItems = 'center';

            const unameLink = document.createElement('a');
            unameLink.href = `https://space.bilibili.com/${reply.mid}`;
            unameLink.target = '_blank';
            unameLink.style.color = 'white';
            unameLink.style.textDecoration = 'underline';
            unameLink.textContent = `${reply.uname} [${reply.mid}]`;
            unameLink.style.marginRight = '10px';
            userInfoRow.appendChild(unameLink);

            const levelSpan = document.createElement('span');
            levelSpan.textContent = `LV${reply.current_level}`;
            levelSpan.style.marginRight = '10px';
            userInfoRow.appendChild(levelSpan);

            const timeSpan = document.createElement('span');
            timeSpan.textContent = formatTime(reply.ctime);
            userInfoRow.appendChild(timeSpan);

            detailDiv.appendChild(userInfoRow);

            // 评论内容节选
            const messageLink = document.createElement('a');
            let currentLink = window.location.href;
            var replyIndex = currentLink.indexOf('#reply');
            if (replyIndex !== -1) {
                currentLink = currentLink.substring(0, replyIndex);
            }
            messageLink.href = `${currentLink}#reply${reply.rpid}`;
            messageLink.target = '_blank';
            messageLink.style.color = 'white';
            messageLink.style.textDecoration = 'underline';
            messageLink.textContent = reply.message.slice(0, 20) + (reply.message.length > 20 ? '...' : '');
            detailDiv.appendChild(messageLink);

            userInfoCell.appendChild(detailDiv);
            row.appendChild(userInfoCell);

            // 是否为粉丝
            const isFollowerCell = document.createElement('td');
            setIsFans(isFollowerCell, reply.mid);

            row.appendChild(isFollowerCell);

            // 发私信
            const sendMessageCell = document.createElement('td');
            const sendMessageButton = document.createElement('button');
            sendMessageButton.textContent = '发私信';
            sendMessageButton.style.backgroundColor = '#ea7a99';
            sendMessageButton.style.color = 'white';
            sendMessageButton.style.border = 'none';
            sendMessageButton.style.padding = '5px 10px';
            sendMessageButton.style.borderRadius = '3px';
            sendMessageButton.style.cursor = 'pointer';
            sendMessageButton.onclick = () => window.open(`https://message.bilibili.com#/whisper/mid${reply.mid}`);
            sendMessageCell.appendChild(sendMessageButton);
            row.appendChild(sendMessageCell);

            const overlayDiv = document.createElement('div');
            overlayDiv.classList.add('info-mask');
            overlayDiv.style.position = 'absolute';
            overlayDiv.style.cursor = 'pointer';
            overlayDiv.style.top = '0';
            overlayDiv.style.left = '0';
            overlayDiv.style.width = '100%';
            overlayDiv.style.height = '100%';
            overlayDiv.style.backgroundColor = '#1d2e48';
            overlayDiv.style.display = 'flex';
            overlayDiv.style.justifyContent = 'center';
            overlayDiv.style.alignItems = 'center';
            overlayDiv.style.color = 'white';
            overlayDiv.style.fontSize = '18px';
            overlayDiv.textContent = '点击查看中奖者';
            overlayDiv.style.opacity = '1';
            overlayDiv.style.transition = 'opacity 0.5s ease-out';
            overlayDiv.onclick = () => {
                overlayDiv.style.opacity = '0';
                setTimeout(() => {
                    overlayDiv.style.display = 'none';
                }, 500);
            };
            row.appendChild(overlayDiv);

            tbody.appendChild(row);
        });
        winnerTable.appendChild(tbody);

        const existingWinnerList = overlay.querySelector('.winner-list');
        if (existingWinnerList) {
            existingWinnerList.replaceWith(winnerTable);
        } else {
            overlay.appendChild(winnerTable);
        }
        winnerTable.classList.add('winner-list');
    }
})();
