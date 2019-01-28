<template>
    <div class="popup__mask">
        <div class="popup__wrapper">
            <div class="popup__container">
                <div class="popup__close" @click="$emit('close-popup')"></div>
                <form class="add-item-form" @submit="sendData">
                    <h2 class="add-item-form__header">{{$t("addItemPopup.header")}}</h2>

                    <div class="add-item-form__group">
                        <label for="form-name">{{$t("addItemPopup.formLabels.name")}}</label>
                        <input id="form-name" type="text" v-model="formData.name">
                        <label for="form-address">{{$t("addItemPopup.formLabels.address")}}</label>
                        <input id="form-address" type="text" v-model="formData.address">
                        <label for="form-PSRN">{{$t("addItemPopup.formLabels.PSRN")}}</label>
                        <input id="form-PSRN" type="number" v-model.number="formData.PSRN">
                        <label for="form-ITN">{{$t("addItemPopup.formLabels.ITN")}}</label>
                        <input id="form-ITN" type="number" v-model.number="formData.ITN" required>
                        <label for="form-registerDate">{{$t("addItemPopup.formLabels.registerDate")}}</label>
                        <input id="form-registerDate" type="text" v-model="formData.registerDate">
                    </div>
                    <button class="add-item-form__button">{{$t("addItemPopup.buttons.formSubmit")}}</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "AddItemPopup",
        data: function() {
            return {
                formData: {
                    ITN: null,
                    PSRN: null,
                    address: "",
                    name: "",
                    registerDate: ""
                }
            }
        },
        methods: {
            sendData: function(e) {
                this.$emit('send-data', Object.assign({}, this.formData));
                this.formData = {
                    ITN: null,
                    PSRN: null,
                    address: "",
                    name: "",
                    registerDate: ""
                };
                e.preventDefault();
            }
        }

    }

</script>

<style scoped>
    .popup__mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: table;
        transition: opacity .3s ease;
    }

    .popup__wrapper {
        display: table-cell;
        vertical-align: middle;
    }

    .popup__container {
        width: 500px;
        margin: 0 auto;
        padding: 20px 30px;
        font-family: Arial, Helvetica, sans-serif;
        color: #666;
        text-shadow: 1px 1px 0 #fff;
        background-color: #eaebec;
        border: #909090 1px solid;
        border-radius: 3px;
        box-shadow: 0 1px 2px #d1d1d1;
        position: relative;
    }

    .popup__close {
        position: absolute;
        top: 10px;
        right: 10px;
        background-image: url("../assets/close-button.svg");
        width: 16px;
        height: 16px;
        cursor: pointer;
    }

    .add-item-form__header {
        text-align: center;
    }

    .add-item-form__group label {
        display: block;
        font-size: 18px;
        margin-bottom: 5px;
    }

    .add-item-form__group input {
        width: 100%;
        margin-bottom: 20px;

        border-radius: 3px;
        height: 20px;
        background-color: #e2e2e2;
        border: #ccc 1px solid;

    }

    .add-item-form__button {
        position: relative;
        left: 50%;
        transform: translateX(-50%);

        width: 150px;
        height: 40px;

        border: #ccc 1px solid;
        border-radius: 3px;
        box-shadow: 0 1px 2px #d1d1d1;
        outline-color: black;
    }

</style>
