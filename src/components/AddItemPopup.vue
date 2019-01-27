<template>
    <div class="popup__mask">
        <div class="popup__wrapper">
            <div class="popup__container">
                <div class="popup__close"
                     @click="$emit('close-popup')"
                ></div>
                <form class="add-item-form"
                      @submit="sendData"
                >
                    <h2 class="add-item-form__header">{{$t("addItemPopup.header")}}</h2>

                    <div class="add-item-form__group">
                        <label for="add-item-form__name">{{$t("addItemPopup.formLabels.name")}}</label>
                        <input id="add-item-form__name" type="text" v-model="formData.name">
                        <label for="add-item-form__address">{{$t("addItemPopup.formLabels.address")}}</label>
                        <input id="add-item-form__address" type="text" v-model="formData.address">
                        <label for="add-item-form__PSRN">{{$t("addItemPopup.formLabels.PSRN")}}</label>
                        <input id="add-item-form__PSRN" type="number" v-model.number="formData.PSRN">
                        <label for="add-item-form__ITN">{{$t("addItemPopup.formLabels.ITN")}}</label>
                        <input id="add-item-form__ITN" type="number" v-model.number="formData.ITN" required>
                        <label for="add-item-form__registerDate">{{$t("addItemPopup.formLabels.registerDate")}}</label>
                        <input id="add-item-form__registerDate" type="text" v-model="formData.registerDate">
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
        data: function () {
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
            sendData: function (e) {
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
        background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTcuMS4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDMxMC4yODUgMzEwLjI4NSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzEwLjI4NSAzMTAuMjg1OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCI+CjxwYXRoIGQ9Ik0yNjQuODQ1LDQ1LjQ0MUMyMzUuNTQyLDE2LjEzOSwxOTYuNTgyLDAsMTU1LjE0MywwUzc0Ljc0MywxNi4xMzksNDUuNDQsNDUuNDQxQzE2LjEzOCw3NC43NDMsMCwxMTMuNzAzLDAsMTU1LjE0MyAgYzAsNDEuNDM5LDE2LjEzOCw4MC4zOTksNDUuNDQsMTA5LjcwMWMyOS4zMDMsMjkuMzAzLDY4LjI2Miw0NS40NCwxMDkuNzAyLDQ1LjQ0czgwLjM5OS0xNi4xMzgsMTA5LjcwMi00NS40NCAgYzI5LjMwMi0yOS4zMDIsNDUuNDQtNjguMjYyLDQ1LjQ0LTEwOS43MDFDMzEwLjI4NSwxMTMuNzAzLDI5NC4xNDcsNzQuNzQzLDI2NC44NDUsNDUuNDQxeiBNMTg5LjcwMiwxNTcuOTg1bDM4LjY2OSwzOC42NjkgIGMzLjEyLDMuMTE5LDMuMTIsOC4xOTQsMCwxMS4zMTNsLTIyLjMzMywyMi4zMzNjLTEuNTA3LDEuNTA3LTMuNTE2LDIuMzM3LTUuNjU3LDIuMzM3Yy0yLjE0MSwwLTQuMTUtMC44My01LjY1Ny0yLjMzNyAgbC0zOC42NjktMzguNjY5Yy0wLjc0OC0wLjc0Ni0yLjA4LTAuNzQ2LTIuODI5LDBsLTM4LjY2OSwzOC42NjljLTEuNTA3LDEuNTA3LTMuNTE2LDIuMzM3LTUuNjU3LDIuMzM3ICBjLTIuMTQxLDAtNC4xNDktMC44My01LjY1Ny0yLjMzNmwtMjIuMzMzLTIyLjMzNGMtMS41MDctMS41MDctMi4zMzctMy41MTYtMi4zMzctNS42NTZjMC0yLjE0MiwwLjgzLTQuMTUsMi4zMzctNS42NTcgIGwzOC42NjktMzguNjY5YzAuNzY2LTAuNzY3LDAuNzY2LTIuMDYzLTAuMDAxLTIuODI5bC00MC4zMDItNDAuMzAyYy0xLjUwNy0xLjUwNy0yLjMzNy0zLjUxNi0yLjMzNy01LjY1NyAgYzAtMi4xNDEsMC44My00LjE0OSwyLjMzNy01LjY1NmwyMi4zMzMtMjIuMzMzYzEuNTA3LTEuNTA3LDMuNTE2LTIuMzM3LDUuNjU3LTIuMzM3YzIuMTQxLDAsNC4xNDksMC44Myw1LjY1NiwyLjMzN2w0MC4zMDMsNDAuMzAzICBjMC43NDksMC43NDcsMi4wODEsMC43NDYsMi44MjgsMGw0MC4zMDMtNDAuMzAzYzEuNTA3LTEuNTA3LDMuNTE2LTIuMzM3LDUuNjU3LTIuMzM3YzIuMTQxLDAsNC4xNDksMC44Myw1LjY1NiwyLjMzN2wyMi4zMzMsMjIuMzMzICBjMS41MDcsMS41MDcsMi4zMzcsMy41MTYsMi4zMzcsNS42NTZjMCwyLjE0Mi0wLjgzLDQuMTUtMi4zMzcsNS42NThsLTQwLjMwMiw0MC4zMDEgIEMxODguOTM2LDE1NS45MjMsMTg4LjkzNiwxNTcuMjE5LDE4OS43MDIsMTU3Ljk4NXoiIGZpbGw9IiM2NjY2NjYiLz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==);
        width: 16px;
        height: 16px;
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