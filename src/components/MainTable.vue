<template>
    <div class="main-block">

        <AddItemPopup v-show="showPopup"
                      @send-data="companiesDataAddItem($event)"
                      @close-popup="showPopup = false"
        />
        <table class="main-table" cellspacing="0">
            <tr class="main-table__header">
                <th>{{$t("mainTable.tableHeaders.name")}}</th>
                <th>{{$t("mainTable.tableHeaders.address")}}</th>
                <th>{{$t("mainTable.tableHeaders.PSRN")}}</th>
                <th>{{$t("mainTable.tableHeaders.ITN")}}</th>
                <th>{{$t("mainTable.tableHeaders.registerDate")}}</th>
                <th>
                    <div class="add-item"
                         @click="showPopup = true"
                    ></div>
                </th>
            </tr>
            <TableItem v-for="(item, index) in companiesData"
                       :itemData="item"
                       :key="item.id"
                       :index="index"
                       @delete-item="companiesDataDeleteItem($event)"
                       @edit-item="companiesDataEditItem($event)"
            />
        </table>
    </div>
</template>

<script>
    import TableItem from './TableItem.vue'
    import AddItemPopup from './AddItemPopup.vue'
    import {HLocalStorage} from '../HLocalStorage.js'

    export default {
        name: "MainTable",
        components: {
            TableItem,
            AddItemPopup
        },
        data: function () {
            return {
                localCompaniesData: {},
                companiesData: [],
                showPopup: false,
                lastId: ""
            }
        },
        methods: {
            findIndexById: function (id) {
                for (let i = 0; i < this.companiesData.length; i++) {
                    if (this.companiesData[i].id === id) return i;
                }

                return -1;
            },
            //Добавление компании в таблицу
            companiesDataAddItem: function (data) {
                this.showPopup = false;
                data.id = this.lastId++;
                this.companiesData.push(data);
                this.localCompaniesData.setData(this.companiesData);
            },
            //Удаление компании из таблицы
            companiesDataDeleteItem: function (id) {
                this.companiesData.splice(this.findIndexById(id), 1);
                this.localCompaniesData.setData(this.companiesData);
            },
            //Изменение компании
            companiesDataEditItem: function (data) {
                this.companiesData.splice(this.findIndexById(data.id), 1, data);
                this.localCompaniesData.setData(this.companiesData);
            }
        },
        created: function () {
            this.localCompaniesData = new HLocalStorage("companiesData");
            this.companiesData = this.localCompaniesData.getData();
            this.lastId = (this.companiesData.length) ? this.companiesData[this.companiesData.length - 1].id + 1 : 0;
        }

    }
</script>

<style>
    .main-table {
        font-family: Arial, Helvetica, sans-serif;
        color: #666;
        font-size: 12px;
        text-shadow: 1px 1px 0 #fff;
        background: #eaebec;
        margin: 20px;
        border: #909090 1px solid;
        border-collapse: separate;
        border-radius: 3px;
        box-shadow: 0 1px 2px #d1d1d1;
    }

    .main-table th {
        font-weight: bold;
        padding: 21px 25px 22px 25px;
        border-top: 1px solid #fafafa;
        border-bottom: 1px solid #e0e0e0;

        background: #ededed;
    }

    .main-table th:first-child {
        text-align: left;
        padding-left: 20px;
    }

    .main-table tr:first-child th:first-child {
        border-top-left-radius: 3px;
    }

    .main-table tr:first-child th:last-child {
        border-top-right-radius: 3px;
    }

    .main-table tr {
        padding-left: 20px;
    }

    .main-table tr td:first-child {
        text-align: left;
        padding-left: 20px;
        border-left: 0;
    }

    .main-table tr td {
        max-width: 500px;
        overflow: hidden;
        padding: 18px;
        border-top: 1px solid #ffffff;
        border-bottom: 1px solid #e0e0e0;
        border-left: 1px solid #e0e0e0;
        vertical-align: middle;
        white-space: nowrap;

        background: #fafafa;
    }

    .main-table tr:nth-child(even) td {
        background: #f6f6f6;
    }

    .main-table tr:last-child td {
        border-bottom: 0;
    }

    .main-table tr:last-child td:first-child {
        border-bottom-left-radius: 3px;
    }

    .main-table tr:last-child td:last-child {
        border-bottom-right-radius: 3px;
    }

    .main-table tr:hover td {
        background: #f2f2f2;
    }

    .main-table a:link {
        color: #666;
        font-weight: bold;
        text-decoration: none;
    }

    .main-table a:visited {
        color: #999999;
        font-weight: bold;
        text-decoration: none;
    }

    .main-table a:active,
    .main-table a:hover {
        color: #bd5a35;
        text-decoration: underline;
    }

    .add-item {
        width: 24px;
        height: 24px;
        cursor: pointer;
        background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUyIDUyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MiA1MjsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiPgo8Zz4KCTxwYXRoIGQ9Ik0yNiwwQzExLjY2NCwwLDAsMTEuNjYzLDAsMjZzMTEuNjY0LDI2LDI2LDI2czI2LTExLjY2MywyNi0yNlM0MC4zMzYsMCwyNiwweiBNMjYsNTBDMTIuNzY3LDUwLDIsMzkuMjMzLDIsMjYgICBTMTIuNzY3LDIsMjYsMnMyNCwxMC43NjcsMjQsMjRTMzkuMjMzLDUwLDI2LDUweiIgZmlsbD0iIzAwMDAwMCIvPgoJPHBhdGggZD0iTTM4LjUsMjVIMjdWMTRjMC0wLjU1My0wLjQ0OC0xLTEtMXMtMSwwLjQ0Ny0xLDF2MTFIMTMuNWMtMC41NTIsMC0xLDAuNDQ3LTEsMXMwLjQ0OCwxLDEsMUgyNXYxMmMwLDAuNTUzLDAuNDQ4LDEsMSwxICAgczEtMC40NDcsMS0xVjI3aDExLjVjMC41NTIsMCwxLTAuNDQ3LDEtMVMzOS4wNTIsMjUsMzguNSwyNXoiIGZpbGw9IiMwMDAwMDAiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K);
    }

    .add-item:hover {
        background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUyIDUyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MiA1MjsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSIyNHB4IiBoZWlnaHQ9IjI0cHgiPgo8Zz4KCTxwYXRoIGQ9Ik0yNiwwQzExLjY2NCwwLDAsMTEuNjYzLDAsMjZzMTEuNjY0LDI2LDI2LDI2czI2LTExLjY2MywyNi0yNlM0MC4zMzYsMCwyNiwweiBNMjYsNTBDMTIuNzY3LDUwLDIsMzkuMjMzLDIsMjYgICBTMTIuNzY3LDIsMjYsMnMyNCwxMC43NjcsMjQsMjRTMzkuMjMzLDUwLDI2LDUweiIgZmlsbD0iIzAwNkRGMCIvPgoJPHBhdGggZD0iTTM4LjUsMjVIMjdWMTRjMC0wLjU1My0wLjQ0OC0xLTEtMXMtMSwwLjQ0Ny0xLDF2MTFIMTMuNWMtMC41NTIsMC0xLDAuNDQ3LTEsMXMwLjQ0OCwxLDEsMUgyNXYxMmMwLDAuNTUzLDAuNDQ4LDEsMSwxICAgczEtMC40NDcsMS0xVjI3aDExLjVjMC41NTIsMCwxLTAuNDQ3LDEtMVMzOS4wNTIsMjUsMzguNSwyNXoiIGZpbGw9IiMwMDZERjAiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K);
    }
</style>