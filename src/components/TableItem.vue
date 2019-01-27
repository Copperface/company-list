<template>
    <tr class="main-table__item">
        <td>{{ itemData.name }}</td>
        <td @dblclick="startEdit">
            <input class="main-table__item-address edit"
                   v-if="editable"
                   v-model="editedAddress"
                   @keyup.esc="finishEdit"
                   @blur="finishEdit"
                   @keyup.enter="finishEdit"
                   ref="editInput"
            />
            <span class="main-table__item-address"
                  v-else
            >{{ itemData.address }}</span>
        </td>
        <td>{{ itemData.PSRN }}</td>
        <td class="main-table__item-psrn"><span>{{ itemData.ITN }}</span>
            <div class="main-table__sync"
                 :class="requestStatus"
                 :data-title="infoMessage"
                 @click="loadItemData"
            ></div>
        </td>
        <td>{{ itemData.registerDate }}</td>
        <td>
            <div class="delete-button"
                 @click="deleteItem"
            ></div>
        </td>
    </tr>
</template>

<script>
    import {getCompanyInfo} from '../api.js'

    export default {
        name: "TableItem",
        props: {
            index: Number,
            itemData: Object
        },
        data: function () {
            return {
                editable: false,
                editedAddress: "",
                infoMessage: this.$t("tableItem.infoMessages.default"),
                requestStatus: ""
            }
        },
        methods: {
            //Начало редактирование адреса
            startEdit: function () {
                if (this.requestStatus === 'PENDING') {
                    return;
                }
                this.editedAddress = this.itemData.address;
                this.editable = true;
                this.$nextTick(() => this.$refs.editInput.focus());
            },
            //Завершение редактирования адреса
            finishEdit: function () {
                let changedData = Object.assign({}, this.itemData);
                changedData.address = this.editedAddress;
                this.$emit('edit-item', changedData);
                this.editable = false;
            },
            deleteItem: function() {
                if (this.requestStatus === 'PENDING') {
                    return;
                }
                this.$emit('delete-item', this.itemData.id);
            },
            //Запрос к API
            loadItemData: function () {
                if (this.requestStatus === 'PENDING') {
                    return;
                }

                this.requestStatus = "PENDING";
                this.infoMessage = this.$t("tableItem.infoMessages.pending");
                getCompanyInfo(this.itemData.ITN)
                    .then(r => {
                        //Ошибка код не 200 останавливаем
                        if (r.status !== 200) {
                            this.infoMessage = this.$t("tableItem.infoMessages.errorResponce", {code: r.status});
                            this.requestStatus = "ERROR";
                            return;
                        }

                        r.json()
                            .then(r => {
                                //Есть информация о компании
                                if (r.suggestions.length) {
                                    let changedData = Object.assign({}, this.itemData);
                                    changedData.name = r.suggestions[0].value;
                                    changedData.address = r.suggestions[0].data.address.value;
                                    changedData.PSRN = r.suggestions[0].data.ogrn;
                                    changedData.registerDate = new Date(r.suggestions[0].data.state.registration_date);
                                    this.$emit('edit-item', changedData);
                                    this.infoMessage = this.$t("tableItem.infoMessages.success");
                                    this.requestStatus = "SUCCESS";
                                } else {
                                    //нет информации о компании
                                    this.infoMessage = this.$t("tableItem.infoMessages.errorEmpty");
                                    this.requestStatus = "ERROR";
                                }
                            })
                            //Остальные ошибки
                            .catch(err => {
                                this.infoMessage = this.$t("tableItem.infoMessages.errorOthers",{err: err});
                                this.requestStatus = "ERROR";
                            })
                    })
            }
        }
    }
</script>

<style scoped>
    .delete-button {
        height: 24px;
        width: 24px;
        margin: 0 auto;
        background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDQ4Mi40MjggNDgyLjQyOSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDgyLjQyOCA0ODIuNDI5OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTM4MS4xNjMsNTcuNzk5aC03NS4wOTRDMzAyLjMyMywyNS4zMTYsMjc0LjY4NiwwLDI0MS4yMTQsMGMtMzMuNDcxLDAtNjEuMTA0LDI1LjMxNS02NC44NSw1Ny43OTloLTc1LjA5OCAgICBjLTMwLjM5LDAtNTUuMTExLDI0LjcyOC01NS4xMTEsNTUuMTE3djIuODI4YzAsMjMuMjIzLDE0LjQ2LDQzLjEsMzQuODMsNTEuMTk5djI2MC4zNjljMCwzMC4zOSwyNC43MjQsNTUuMTE3LDU1LjExMiw1NS4xMTcgICAgaDIxMC4yMzZjMzAuMzg5LDAsNTUuMTExLTI0LjcyOSw1NS4xMTEtNTUuMTE3VjE2Ni45NDRjMjAuMzY5LTguMSwzNC44My0yNy45NzcsMzQuODMtNTEuMTk5di0yLjgyOCAgICBDNDM2LjI3NCw4Mi41MjcsNDExLjU1MSw1Ny43OTksMzgxLjE2Myw1Ny43OTl6IE0yNDEuMjE0LDI2LjEzOWMxOS4wMzcsMCwzNC45MjcsMTMuNjQ1LDM4LjQ0MywzMS42NmgtNzYuODc5ICAgIEMyMDYuMjkzLDM5Ljc4MywyMjIuMTg0LDI2LjEzOSwyNDEuMjE0LDI2LjEzOXogTTM3NS4zMDUsNDI3LjMxMmMwLDE1Ljk3OC0xMywyOC45NzktMjguOTczLDI4Ljk3OUgxMzYuMDk2ICAgIGMtMTUuOTczLDAtMjguOTczLTEzLjAwMi0yOC45NzMtMjguOTc5VjE3MC44NjFoMjY4LjE4MlY0MjcuMzEyeiBNNDEwLjEzNSwxMTUuNzQ0YzAsMTUuOTc4LTEzLDI4Ljk3OS0yOC45NzMsMjguOTc5SDEwMS4yNjYgICAgYy0xNS45NzMsMC0yOC45NzMtMTMuMDAxLTI4Ljk3My0yOC45Nzl2LTIuODI4YzAtMTUuOTc4LDEzLTI4Ljk3OSwyOC45NzMtMjguOTc5aDI3OS44OTdjMTUuOTczLDAsMjguOTczLDEzLjAwMSwyOC45NzMsMjguOTc5ICAgIFYxMTUuNzQ0eiIgZmlsbD0iIzAwMDAwMCIvPgoJCTxwYXRoIGQ9Ik0xNzEuMTQ0LDQyMi44NjNjNy4yMTgsMCwxMy4wNjktNS44NTMsMTMuMDY5LTEzLjA2OFYyNjIuNjQxYzAtNy4yMTYtNS44NTItMTMuMDctMTMuMDY5LTEzLjA3ICAgIGMtNy4yMTcsMC0xMy4wNjksNS44NTQtMTMuMDY5LDEzLjA3djE0Ny4xNTRDMTU4LjA3NCw0MTcuMDEyLDE2My45MjYsNDIyLjg2MywxNzEuMTQ0LDQyMi44NjN6IiBmaWxsPSIjMDAwMDAwIi8+CgkJPHBhdGggZD0iTTI0MS4yMTQsNDIyLjg2M2M3LjIxOCwwLDEzLjA3LTUuODUzLDEzLjA3LTEzLjA2OFYyNjIuNjQxYzAtNy4yMTYtNS44NTQtMTMuMDctMTMuMDctMTMuMDcgICAgYy03LjIxNywwLTEzLjA2OSw1Ljg1NC0xMy4wNjksMTMuMDd2MTQ3LjE1NEMyMjguMTQ1LDQxNy4wMTIsMjMzLjk5Niw0MjIuODYzLDI0MS4yMTQsNDIyLjg2M3oiIGZpbGw9IiMwMDAwMDAiLz4KCQk8cGF0aCBkPSJNMzExLjI4NCw0MjIuODYzYzcuMjE3LDAsMTMuMDY4LTUuODUzLDEzLjA2OC0xMy4wNjhWMjYyLjY0MWMwLTcuMjE2LTUuODUyLTEzLjA3LTEzLjA2OC0xMy4wNyAgICBjLTcuMjE5LDAtMTMuMDcsNS44NTQtMTMuMDcsMTMuMDd2MTQ3LjE1NEMyOTguMjEzLDQxNy4wMTIsMzA0LjA2Nyw0MjIuODYzLDMxMS4yODQsNDIyLjg2M3oiIGZpbGw9IiMwMDAwMDAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K);
        background-repeat: no-repeat;
        background-position: center;
        cursor: pointer;
    }

    .delete-button:hover {
        background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDQ4Mi40MjggNDgyLjQyOSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDgyLjQyOCA0ODIuNDI5OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPGc+CgkJPHBhdGggZD0iTTM4MS4xNjMsNTcuNzk5aC03NS4wOTRDMzAyLjMyMywyNS4zMTYsMjc0LjY4NiwwLDI0MS4yMTQsMGMtMzMuNDcxLDAtNjEuMTA0LDI1LjMxNS02NC44NSw1Ny43OTloLTc1LjA5OCAgICBjLTMwLjM5LDAtNTUuMTExLDI0LjcyOC01NS4xMTEsNTUuMTE3djIuODI4YzAsMjMuMjIzLDE0LjQ2LDQzLjEsMzQuODMsNTEuMTk5djI2MC4zNjljMCwzMC4zOSwyNC43MjQsNTUuMTE3LDU1LjExMiw1NS4xMTcgICAgaDIxMC4yMzZjMzAuMzg5LDAsNTUuMTExLTI0LjcyOSw1NS4xMTEtNTUuMTE3VjE2Ni45NDRjMjAuMzY5LTguMSwzNC44My0yNy45NzcsMzQuODMtNTEuMTk5di0yLjgyOCAgICBDNDM2LjI3NCw4Mi41MjcsNDExLjU1MSw1Ny43OTksMzgxLjE2Myw1Ny43OTl6IE0yNDEuMjE0LDI2LjEzOWMxOS4wMzcsMCwzNC45MjcsMTMuNjQ1LDM4LjQ0MywzMS42NmgtNzYuODc5ICAgIEMyMDYuMjkzLDM5Ljc4MywyMjIuMTg0LDI2LjEzOSwyNDEuMjE0LDI2LjEzOXogTTM3NS4zMDUsNDI3LjMxMmMwLDE1Ljk3OC0xMywyOC45NzktMjguOTczLDI4Ljk3OUgxMzYuMDk2ICAgIGMtMTUuOTczLDAtMjguOTczLTEzLjAwMi0yOC45NzMtMjguOTc5VjE3MC44NjFoMjY4LjE4MlY0MjcuMzEyeiBNNDEwLjEzNSwxMTUuNzQ0YzAsMTUuOTc4LTEzLDI4Ljk3OS0yOC45NzMsMjguOTc5SDEwMS4yNjYgICAgYy0xNS45NzMsMC0yOC45NzMtMTMuMDAxLTI4Ljk3My0yOC45Nzl2LTIuODI4YzAtMTUuOTc4LDEzLTI4Ljk3OSwyOC45NzMtMjguOTc5aDI3OS44OTdjMTUuOTczLDAsMjguOTczLDEzLjAwMSwyOC45NzMsMjguOTc5ICAgIFYxMTUuNzQ0eiIgZmlsbD0iIzAwNkRGMCIvPgoJCTxwYXRoIGQ9Ik0xNzEuMTQ0LDQyMi44NjNjNy4yMTgsMCwxMy4wNjktNS44NTMsMTMuMDY5LTEzLjA2OFYyNjIuNjQxYzAtNy4yMTYtNS44NTItMTMuMDctMTMuMDY5LTEzLjA3ICAgIGMtNy4yMTcsMC0xMy4wNjksNS44NTQtMTMuMDY5LDEzLjA3djE0Ny4xNTRDMTU4LjA3NCw0MTcuMDEyLDE2My45MjYsNDIyLjg2MywxNzEuMTQ0LDQyMi44NjN6IiBmaWxsPSIjMDA2REYwIi8+CgkJPHBhdGggZD0iTTI0MS4yMTQsNDIyLjg2M2M3LjIxOCwwLDEzLjA3LTUuODUzLDEzLjA3LTEzLjA2OFYyNjIuNjQxYzAtNy4yMTYtNS44NTQtMTMuMDctMTMuMDctMTMuMDcgICAgYy03LjIxNywwLTEzLjA2OSw1Ljg1NC0xMy4wNjksMTMuMDd2MTQ3LjE1NEMyMjguMTQ1LDQxNy4wMTIsMjMzLjk5Niw0MjIuODYzLDI0MS4yMTQsNDIyLjg2M3oiIGZpbGw9IiMwMDZERjAiLz4KCQk8cGF0aCBkPSJNMzExLjI4NCw0MjIuODYzYzcuMjE3LDAsMTMuMDY4LTUuODUzLDEzLjA2OC0xMy4wNjhWMjYyLjY0MWMwLTcuMjE2LTUuODUyLTEzLjA3LTEzLjA2OC0xMy4wNyAgICBjLTcuMjE5LDAtMTMuMDcsNS44NTQtMTMuMDcsMTMuMDd2MTQ3LjE1NEMyOTguMjEzLDQxNy4wMTIsMzA0LjA2Nyw0MjIuODYzLDMxMS4yODQsNDIyLjg2M3oiIGZpbGw9IiMwMDZERjAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K);
    }

    .main-table__item-psrn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: visible;
    }

    .main-table__sync {
        display: inline-block;
        width: 24px;
        height: 24px;
        margin-left: 10px;

        background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDQ4Ny4yMyA0ODcuMjMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ4Ny4yMyA0ODcuMjM7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNTUuMzIzLDIwMy42NDFjMTUuNjY0LDAsMjkuODEzLTkuNDA1LDM1Ljg3Mi0yMy44NTRjMjUuMDE3LTU5LjYwNCw4My44NDItMTAxLjYxLDE1Mi40Mi0xMDEuNjEgICAgYzM3Ljc5NywwLDcyLjQ0OSwxMi45NTUsMTAwLjIzLDM0LjQ0MmwtMjEuNzc1LDMuMzcxYy03LjQzOCwxLjE1My0xMy4yMjQsNy4wNTQtMTQuMjMyLDE0LjUxMiAgICBjLTEuMDEsNy40NTQsMy4wMDgsMTQuNjg2LDkuODY3LDE3Ljc2OGwxMTkuNzQ2LDUzLjg3MmM1LjI0OSwyLjM1NywxMS4zMywxLjkwNCwxNi4xNjgtMS4yMDUgICAgYzQuODMtMy4xMTQsNy43NjQtOC40NTgsNy43OTYtMTQuMjA4bDAuNjIxLTEzMS45NDNjMC4wNDItNy41MDYtNC44NTEtMTQuMTQ0LTEyLjAyNC0xNi4zMzIgICAgYy03LjE4NS0yLjE4OC0xNC45NDcsMC41ODktMTkuMTA0LDYuODM3bC0xNi41MDUsMjQuODA1QzM3MC4zOTgsMjYuNzc4LDMxMC4xLDAsMjQzLjYxNSwwQzE0Mi44MDYsMCw1Ni4xMzMsNjEuNTYyLDE5LjE2NywxNDkuMDYgICAgYy01LjEzNCwxMi4xMjgtMy44NCwyNi4wMTUsMy40MjksMzYuOTg3QzI5Ljg2NSwxOTcuMDIzLDQyLjE1MiwyMDMuNjQxLDU1LjMyMywyMDMuNjQxeiIgZmlsbD0iIzAwMDAwMCIvPgoJCTxwYXRoIGQ9Ik00NjQuNjM1LDMwMS4xODRjLTcuMjctMTAuOTc3LTE5LjU1OC0xNy41OTQtMzIuNzI4LTE3LjU5NGMtMTUuNjY0LDAtMjkuODEzLDkuNDA1LTM1Ljg3MiwyMy44NTQgICAgYy0yNS4wMTgsNTkuNjA0LTgzLjg0MywxMDEuNjEtMTUyLjQyLDEwMS42MWMtMzcuNzk4LDAtNzIuNDUtMTIuOTU1LTEwMC4yMzItMzQuNDQybDIxLjc3Ni0zLjM2OSAgICBjNy40MzctMS4xNTMsMTMuMjIzLTcuMDU1LDE0LjIzMy0xNC41MTRjMS4wMDktNy40NTMtMy4wMDgtMTQuNjg2LTkuODY3LTE3Ljc2OEw0OS43NzksMjg1LjA4OSAgICBjLTUuMjUtMi4zNTYtMTEuMzMtMS45MDUtMTYuMTY5LDEuMjA1Yy00LjgyOSwzLjExNC03Ljc2NCw4LjQ1OC03Ljc5NSwxNC4yMDdsLTAuNjIyLDEzMS45NDMgICAgYy0wLjA0Miw3LjUwNiw0Ljg1LDE0LjE0NCwxMi4wMjQsMTYuMzMyYzcuMTg1LDIuMTg4LDE0Ljk0OC0wLjU5LDE5LjEwNC02LjgzOWwxNi41MDUtMjQuODA1ICAgIGM0NC4wMDQsNDMuMzIsMTA0LjMwMyw3MC4wOTgsMTcwLjc4OCw3MC4wOThjMTAwLjgxMSwwLDE4Ny40ODEtNjEuNTYxLDIyNC40NDYtMTQ5LjA1OSAgICBDNDczLjE5NywzMjYuMDQzLDQ3MS45MDMsMzEyLjE1Nyw0NjQuNjM1LDMwMS4xODR6IiBmaWxsPSIjMDAwMDAwIi8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==);
        background-repeat: no-repeat;
        background-position: center;
        float: right;
        cursor: pointer;
        position: relative;
    }

    .main-table__sync:not(.SUCCESS, .PENDING, .ERROR):hover {
        background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDQ4Ny4yMyA0ODcuMjMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ4Ny4yMyA0ODcuMjM7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNTUuMzIzLDIwMy42NDFjMTUuNjY0LDAsMjkuODEzLTkuNDA1LDM1Ljg3Mi0yMy44NTRjMjUuMDE3LTU5LjYwNCw4My44NDItMTAxLjYxLDE1Mi40Mi0xMDEuNjEgICAgYzM3Ljc5NywwLDcyLjQ0OSwxMi45NTUsMTAwLjIzLDM0LjQ0MmwtMjEuNzc1LDMuMzcxYy03LjQzOCwxLjE1My0xMy4yMjQsNy4wNTQtMTQuMjMyLDE0LjUxMiAgICBjLTEuMDEsNy40NTQsMy4wMDgsMTQuNjg2LDkuODY3LDE3Ljc2OGwxMTkuNzQ2LDUzLjg3MmM1LjI0OSwyLjM1NywxMS4zMywxLjkwNCwxNi4xNjgtMS4yMDUgICAgYzQuODMtMy4xMTQsNy43NjQtOC40NTgsNy43OTYtMTQuMjA4bDAuNjIxLTEzMS45NDNjMC4wNDItNy41MDYtNC44NTEtMTQuMTQ0LTEyLjAyNC0xNi4zMzIgICAgYy03LjE4NS0yLjE4OC0xNC45NDcsMC41ODktMTkuMTA0LDYuODM3bC0xNi41MDUsMjQuODA1QzM3MC4zOTgsMjYuNzc4LDMxMC4xLDAsMjQzLjYxNSwwQzE0Mi44MDYsMCw1Ni4xMzMsNjEuNTYyLDE5LjE2NywxNDkuMDYgICAgYy01LjEzNCwxMi4xMjgtMy44NCwyNi4wMTUsMy40MjksMzYuOTg3QzI5Ljg2NSwxOTcuMDIzLDQyLjE1MiwyMDMuNjQxLDU1LjMyMywyMDMuNjQxeiIgZmlsbD0iIzAwNkRGMCIvPgoJCTxwYXRoIGQ9Ik00NjQuNjM1LDMwMS4xODRjLTcuMjctMTAuOTc3LTE5LjU1OC0xNy41OTQtMzIuNzI4LTE3LjU5NGMtMTUuNjY0LDAtMjkuODEzLDkuNDA1LTM1Ljg3MiwyMy44NTQgICAgYy0yNS4wMTgsNTkuNjA0LTgzLjg0MywxMDEuNjEtMTUyLjQyLDEwMS42MWMtMzcuNzk4LDAtNzIuNDUtMTIuOTU1LTEwMC4yMzItMzQuNDQybDIxLjc3Ni0zLjM2OSAgICBjNy40MzctMS4xNTMsMTMuMjIzLTcuMDU1LDE0LjIzMy0xNC41MTRjMS4wMDktNy40NTMtMy4wMDgtMTQuNjg2LTkuODY3LTE3Ljc2OEw0OS43NzksMjg1LjA4OSAgICBjLTUuMjUtMi4zNTYtMTEuMzMtMS45MDUtMTYuMTY5LDEuMjA1Yy00LjgyOSwzLjExNC03Ljc2NCw4LjQ1OC03Ljc5NSwxNC4yMDdsLTAuNjIyLDEzMS45NDMgICAgYy0wLjA0Miw3LjUwNiw0Ljg1LDE0LjE0NCwxMi4wMjQsMTYuMzMyYzcuMTg1LDIuMTg4LDE0Ljk0OC0wLjU5LDE5LjEwNC02LjgzOWwxNi41MDUtMjQuODA1ICAgIGM0NC4wMDQsNDMuMzIsMTA0LjMwMyw3MC4wOTgsMTcwLjc4OCw3MC4wOThjMTAwLjgxMSwwLDE4Ny40ODEtNjEuNTYxLDIyNC40NDYtMTQ5LjA1OSAgICBDNDczLjE5NywzMjYuMDQzLDQ3MS45MDMsMzEyLjE1Nyw0NjQuNjM1LDMwMS4xODR6IiBmaWxsPSIjMDA2REYwIi8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==);
    }

    .main-table__sync.SUCCESS {
        background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDQ4Ny4yMyA0ODcuMjMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ4Ny4yMyA0ODcuMjM7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNTUuMzIzLDIwMy42NDFjMTUuNjY0LDAsMjkuODEzLTkuNDA1LDM1Ljg3Mi0yMy44NTRjMjUuMDE3LTU5LjYwNCw4My44NDItMTAxLjYxLDE1Mi40Mi0xMDEuNjEgICAgYzM3Ljc5NywwLDcyLjQ0OSwxMi45NTUsMTAwLjIzLDM0LjQ0MmwtMjEuNzc1LDMuMzcxYy03LjQzOCwxLjE1My0xMy4yMjQsNy4wNTQtMTQuMjMyLDE0LjUxMiAgICBjLTEuMDEsNy40NTQsMy4wMDgsMTQuNjg2LDkuODY3LDE3Ljc2OGwxMTkuNzQ2LDUzLjg3MmM1LjI0OSwyLjM1NywxMS4zMywxLjkwNCwxNi4xNjgtMS4yMDUgICAgYzQuODMtMy4xMTQsNy43NjQtOC40NTgsNy43OTYtMTQuMjA4bDAuNjIxLTEzMS45NDNjMC4wNDItNy41MDYtNC44NTEtMTQuMTQ0LTEyLjAyNC0xNi4zMzIgICAgYy03LjE4NS0yLjE4OC0xNC45NDcsMC41ODktMTkuMTA0LDYuODM3bC0xNi41MDUsMjQuODA1QzM3MC4zOTgsMjYuNzc4LDMxMC4xLDAsMjQzLjYxNSwwQzE0Mi44MDYsMCw1Ni4xMzMsNjEuNTYyLDE5LjE2NywxNDkuMDYgICAgYy01LjEzNCwxMi4xMjgtMy44NCwyNi4wMTUsMy40MjksMzYuOTg3QzI5Ljg2NSwxOTcuMDIzLDQyLjE1MiwyMDMuNjQxLDU1LjMyMywyMDMuNjQxeiIgZmlsbD0iIzVkOTQzNSIvPgoJCTxwYXRoIGQ9Ik00NjQuNjM1LDMwMS4xODRjLTcuMjctMTAuOTc3LTE5LjU1OC0xNy41OTQtMzIuNzI4LTE3LjU5NGMtMTUuNjY0LDAtMjkuODEzLDkuNDA1LTM1Ljg3MiwyMy44NTQgICAgYy0yNS4wMTgsNTkuNjA0LTgzLjg0MywxMDEuNjEtMTUyLjQyLDEwMS42MWMtMzcuNzk4LDAtNzIuNDUtMTIuOTU1LTEwMC4yMzItMzQuNDQybDIxLjc3Ni0zLjM2OSAgICBjNy40MzctMS4xNTMsMTMuMjIzLTcuMDU1LDE0LjIzMy0xNC41MTRjMS4wMDktNy40NTMtMy4wMDgtMTQuNjg2LTkuODY3LTE3Ljc2OEw0OS43NzksMjg1LjA4OSAgICBjLTUuMjUtMi4zNTYtMTEuMzMtMS45MDUtMTYuMTY5LDEuMjA1Yy00LjgyOSwzLjExNC03Ljc2NCw4LjQ1OC03Ljc5NSwxNC4yMDdsLTAuNjIyLDEzMS45NDMgICAgYy0wLjA0Miw3LjUwNiw0Ljg1LDE0LjE0NCwxMi4wMjQsMTYuMzMyYzcuMTg1LDIuMTg4LDE0Ljk0OC0wLjU5LDE5LjEwNC02LjgzOWwxNi41MDUtMjQuODA1ICAgIGM0NC4wMDQsNDMuMzIsMTA0LjMwMyw3MC4wOTgsMTcwLjc4OCw3MC4wOThjMTAwLjgxMSwwLDE4Ny40ODEtNjEuNTYxLDIyNC40NDYtMTQ5LjA1OSAgICBDNDczLjE5NywzMjYuMDQzLDQ3MS45MDMsMzEyLjE1Nyw0NjQuNjM1LDMwMS4xODR6IiBmaWxsPSIjNWQ5NDM1Ii8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==);
    }

    .main-table__sync.PENDING {
        background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDQ4Ny4yMyA0ODcuMjMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ4Ny4yMyA0ODcuMjM7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNTUuMzIzLDIwMy42NDFjMTUuNjY0LDAsMjkuODEzLTkuNDA1LDM1Ljg3Mi0yMy44NTRjMjUuMDE3LTU5LjYwNCw4My44NDItMTAxLjYxLDE1Mi40Mi0xMDEuNjEgICAgYzM3Ljc5NywwLDcyLjQ0OSwxMi45NTUsMTAwLjIzLDM0LjQ0MmwtMjEuNzc1LDMuMzcxYy03LjQzOCwxLjE1My0xMy4yMjQsNy4wNTQtMTQuMjMyLDE0LjUxMiAgICBjLTEuMDEsNy40NTQsMy4wMDgsMTQuNjg2LDkuODY3LDE3Ljc2OGwxMTkuNzQ2LDUzLjg3MmM1LjI0OSwyLjM1NywxMS4zMywxLjkwNCwxNi4xNjgtMS4yMDUgICAgYzQuODMtMy4xMTQsNy43NjQtOC40NTgsNy43OTYtMTQuMjA4bDAuNjIxLTEzMS45NDNjMC4wNDItNy41MDYtNC44NTEtMTQuMTQ0LTEyLjAyNC0xNi4zMzIgICAgYy03LjE4NS0yLjE4OC0xNC45NDcsMC41ODktMTkuMTA0LDYuODM3bC0xNi41MDUsMjQuODA1QzM3MC4zOTgsMjYuNzc4LDMxMC4xLDAsMjQzLjYxNSwwQzE0Mi44MDYsMCw1Ni4xMzMsNjEuNTYyLDE5LjE2NywxNDkuMDYgICAgYy01LjEzNCwxMi4xMjgtMy44NCwyNi4wMTUsMy40MjksMzYuOTg3QzI5Ljg2NSwxOTcuMDIzLDQyLjE1MiwyMDMuNjQxLDU1LjMyMywyMDMuNjQxeiIgZmlsbD0iI0ZGREE0NCIvPgoJCTxwYXRoIGQ9Ik00NjQuNjM1LDMwMS4xODRjLTcuMjctMTAuOTc3LTE5LjU1OC0xNy41OTQtMzIuNzI4LTE3LjU5NGMtMTUuNjY0LDAtMjkuODEzLDkuNDA1LTM1Ljg3MiwyMy44NTQgICAgYy0yNS4wMTgsNTkuNjA0LTgzLjg0MywxMDEuNjEtMTUyLjQyLDEwMS42MWMtMzcuNzk4LDAtNzIuNDUtMTIuOTU1LTEwMC4yMzItMzQuNDQybDIxLjc3Ni0zLjM2OSAgICBjNy40MzctMS4xNTMsMTMuMjIzLTcuMDU1LDE0LjIzMy0xNC41MTRjMS4wMDktNy40NTMtMy4wMDgtMTQuNjg2LTkuODY3LTE3Ljc2OEw0OS43NzksMjg1LjA4OSAgICBjLTUuMjUtMi4zNTYtMTEuMzMtMS45MDUtMTYuMTY5LDEuMjA1Yy00LjgyOSwzLjExNC03Ljc2NCw4LjQ1OC03Ljc5NSwxNC4yMDdsLTAuNjIyLDEzMS45NDMgICAgYy0wLjA0Miw3LjUwNiw0Ljg1LDE0LjE0NCwxMi4wMjQsMTYuMzMyYzcuMTg1LDIuMTg4LDE0Ljk0OC0wLjU5LDE5LjEwNC02LjgzOWwxNi41MDUtMjQuODA1ICAgIGM0NC4wMDQsNDMuMzIsMTA0LjMwMyw3MC4wOTgsMTcwLjc4OCw3MC4wOThjMTAwLjgxMSwwLDE4Ny40ODEtNjEuNTYxLDIyNC40NDYtMTQ5LjA1OSAgICBDNDczLjE5NywzMjYuMDQzLDQ3MS45MDMsMzEyLjE1Nyw0NjQuNjM1LDMwMS4xODR6IiBmaWxsPSIjRkZEQTQ0Ii8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==);
    }

    .main-table__sync.ERROR {
        background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDQ4Ny4yMyA0ODcuMjMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ4Ny4yMyA0ODcuMjM7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8Zz4KCQk8cGF0aCBkPSJNNTUuMzIzLDIwMy42NDFjMTUuNjY0LDAsMjkuODEzLTkuNDA1LDM1Ljg3Mi0yMy44NTRjMjUuMDE3LTU5LjYwNCw4My44NDItMTAxLjYxLDE1Mi40Mi0xMDEuNjEgICAgYzM3Ljc5NywwLDcyLjQ0OSwxMi45NTUsMTAwLjIzLDM0LjQ0MmwtMjEuNzc1LDMuMzcxYy03LjQzOCwxLjE1My0xMy4yMjQsNy4wNTQtMTQuMjMyLDE0LjUxMiAgICBjLTEuMDEsNy40NTQsMy4wMDgsMTQuNjg2LDkuODY3LDE3Ljc2OGwxMTkuNzQ2LDUzLjg3MmM1LjI0OSwyLjM1NywxMS4zMywxLjkwNCwxNi4xNjgtMS4yMDUgICAgYzQuODMtMy4xMTQsNy43NjQtOC40NTgsNy43OTYtMTQuMjA4bDAuNjIxLTEzMS45NDNjMC4wNDItNy41MDYtNC44NTEtMTQuMTQ0LTEyLjAyNC0xNi4zMzIgICAgYy03LjE4NS0yLjE4OC0xNC45NDcsMC41ODktMTkuMTA0LDYuODM3bC0xNi41MDUsMjQuODA1QzM3MC4zOTgsMjYuNzc4LDMxMC4xLDAsMjQzLjYxNSwwQzE0Mi44MDYsMCw1Ni4xMzMsNjEuNTYyLDE5LjE2NywxNDkuMDYgICAgYy01LjEzNCwxMi4xMjgtMy44NCwyNi4wMTUsMy40MjksMzYuOTg3QzI5Ljg2NSwxOTcuMDIzLDQyLjE1MiwyMDMuNjQxLDU1LjMyMywyMDMuNjQxeiIgZmlsbD0iI0Q4MDAyNyIvPgoJCTxwYXRoIGQ9Ik00NjQuNjM1LDMwMS4xODRjLTcuMjctMTAuOTc3LTE5LjU1OC0xNy41OTQtMzIuNzI4LTE3LjU5NGMtMTUuNjY0LDAtMjkuODEzLDkuNDA1LTM1Ljg3MiwyMy44NTQgICAgYy0yNS4wMTgsNTkuNjA0LTgzLjg0MywxMDEuNjEtMTUyLjQyLDEwMS42MWMtMzcuNzk4LDAtNzIuNDUtMTIuOTU1LTEwMC4yMzItMzQuNDQybDIxLjc3Ni0zLjM2OSAgICBjNy40MzctMS4xNTMsMTMuMjIzLTcuMDU1LDE0LjIzMy0xNC41MTRjMS4wMDktNy40NTMtMy4wMDgtMTQuNjg2LTkuODY3LTE3Ljc2OEw0OS43NzksMjg1LjA4OSAgICBjLTUuMjUtMi4zNTYtMTEuMzMtMS45MDUtMTYuMTY5LDEuMjA1Yy00LjgyOSwzLjExNC03Ljc2NCw4LjQ1OC03Ljc5NSwxNC4yMDdsLTAuNjIyLDEzMS45NDMgICAgYy0wLjA0Miw3LjUwNiw0Ljg1LDE0LjE0NCwxMi4wMjQsMTYuMzMyYzcuMTg1LDIuMTg4LDE0Ljk0OC0wLjU5LDE5LjEwNC02LjgzOWwxNi41MDUtMjQuODA1ICAgIGM0NC4wMDQsNDMuMzIsMTA0LjMwMyw3MC4wOTgsMTcwLjc4OCw3MC4wOThjMTAwLjgxMSwwLDE4Ny40ODEtNjEuNTYxLDIyNC40NDYtMTQ5LjA1OSAgICBDNDczLjE5NywzMjYuMDQzLDQ3MS45MDMsMzEyLjE1Nyw0NjQuNjM1LDMwMS4xODR6IiBmaWxsPSIjRDgwMDI3Ii8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==);
    }

    .main-table__sync:hover::after {
        content: attr(data-title);
        position: absolute;
        left: 40%;
        top: 70%;
        z-index: 100;
        background-color: #ededed;
        font-family: Arial, sans-serif;
        font-size: 11px;
        padding: 5px 10px;
        border: 1px solid #333;
    }

    .edit {
        width: 100%;
        height: 24px;

        border-radius: 3px;
        background-color: #e2e2e2;
        border: #ccc 1px solid;
        outline-color: black;
    }
</style>