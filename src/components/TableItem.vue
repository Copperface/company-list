<template>
    <tr class="main-table__item">
        <td>{{ itemData.name }}</td>
        <td @dblclick="startEdit">
            <input class="main-table__item-address edit" v-if="editable" v-model="editedAddress" @keyup.esc="finishEdit" @blur="finishEdit" @keyup.enter="finishEdit" ref="editInput" />
            <span class="main-table__item-address" v-else>{{ itemData.address }}</span>
        </td>
        <td>{{ itemData.PSRN }}</td>
        <td class="main-table__item-psrn"><span>{{ itemData.ITN }}</span>
            <div class="main-table__sync" :class="requestStatus" :data-title="infoMessage" @click="loadItemData"></div>
        </td>
        <td>{{ itemData.registerDate }}</td>
        <td>
            <div class="delete-button" @click="deleteItem"></div>
        </td>
    </tr>
</template>

<script>
    import {
        getCompanyInfo
    } from '../api.js'

    export default {
        name: "TableItem",
        props: {
            index: Number,
            itemData: Object
        },
        data: function() {
            return {
                editable: false,
                editedAddress: "",
                infoMessage: this.$t("tableItem.infoMessages.default"),
                requestStatus: ""
            }
        },
        methods: {
            //Начало редактирование адреса
            startEdit: function() {
                if (this.requestStatus === 'PENDING') {
                    return;
                }
                this.editedAddress = this.itemData.address;
                this.editable = true;
                this.$nextTick(() => this.$refs.editInput.focus());
            },
            //Завершение редактирования адреса
            finishEdit: function() {
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
            loadItemData: function() {
                if (this.requestStatus === 'PENDING') {
                    return;
                }

                this.requestStatus = "PENDING";
                this.infoMessage = this.$t("tableItem.infoMessages.pending");
                getCompanyInfo(this.itemData.ITN)
                    .then(r => r.json())
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
                        this.infoMessage = this.$t("tableItem.infoMessages.errorOther", {
                            err: err
                        });
                        this.requestStatus = "ERROR";
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
        background-image: url("../assets/delete-button-default.svg");
        background-repeat: no-repeat;
        background-position: center;
        cursor: pointer;
    }

    .delete-button:hover {
        background-image: url("../assets/delete-button-hover.svg");
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

        background-image: url("../assets/sync-button-default.svg");
        background-repeat: no-repeat;
        background-position: center;
        float: right;
        cursor: pointer;
        position: relative;
    }

    .main-table__sync:not(.SUCCESS, .PENDING, .ERROR):hover {
        background-image: url("../assets/sync-button-hover.svg");
    }

    .main-table__sync.SUCCESS {
        background-image: url("../assets/sync-button-success.svg");
    }

    .main-table__sync.PENDING {
        background-image: url("../assets/sync-button-pending.svg");
    }

    .main-table__sync.ERROR {
        background-image: url("../assets/sync-button-error.svg");
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
