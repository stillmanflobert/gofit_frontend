<template>
    <v-main class="container">
        <v-card class="pa-8 gym-bg" width="1700">
            <h1 class="text-h3 text-center white--text font-weight-bold">Member Kadaluarsa </h1>
        </v-card>
        <v-spacer style="height: 30px;"></v-spacer>
        <v-btn class="mx-2" fab dark color="indigo" @click="dialogConfirm = true">
            <v-icon dark>
                mdi-account-off
            </v-icon>
        </v-btn>
        <v-spacer style="height: 30px;"></v-spacer>
        <v-data-table :headers="headers" :items="dataMember">
            <template v-slot:item="{ item }">
                <tr @click="dialogProcess(item.ID_MEMBER); formProcess(item);">
                    <td>{{ item.ID_MEMBER }}</td>
                    <td>{{ item.NAMA_MEMBER }}</td>
                    <td>{{ item.ALAMAT_MEMBER }}</td>
                    <td>{{ item.TELEPON_MEMBER }}</td>
                    <td>{{ item.JUMLAH_DEPOSIT_UANG }}</td>
                    <td>{{ item.EMAIL }}</td>
                    <td v-if="item.STATUS == 1">Aktif</td>
                    <td v-else>Non Aktif</td>
                </tr>
            </template>
        </v-data-table>

        <v-dialog v-model="dialogConfirm" persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark>Are You Sure To deactivated all of this member?</v-toolbar>
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click=" dialogConfirm = false">NO</v-btn>
                    <v-btn color="red" text @click="confirmProcces">YES</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-main>
</template>
<script>
import axios from 'axios';
import store from '@/store/index';
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import router from '@/router'
import { onMounted } from 'vue'

export default {
    data() {
        return {
            headers: [
                { text: 'ID', value: 'ID_MEMBER' },
                { text: 'Nama', value: 'NAMA_MEMBER' },
                { text: 'Alamat', value: 'ALAMAT_MEMBER' },
                { text: 'No. Telp', value: 'TELEPON_MEMBER' },
                { text: 'Jumlah Deposit', value: 'JUMLAH_DEPOSIT_UANG' },
                { text: 'Email', value: 'EMAIL' },
                { text: 'Status', value: 'Status' },
            ],
            dataMember: store.state.memberKadaluarsa.data,
            dialogConfirm: false,
        }
    },
    setup() {
        onMounted(async () => {
            const member = await axios.get(store.state.domainName + 'cek-member-kadaluarsa')
            store.commit('setDataMemberKadaluarsa', member.data)
        })
    },
    async mounted() {
        setInterval(() => {
            const data = axios.get(store.state.domainName + 'cek-member-kadaluarsa')
            store.commit('setDataMemberKadaluarsa', data.data)
        }, 10000)
    },
    methods: {
        async confirmProcces() {
            axios.post(store.state.domainName + 'deactivated-member')
                .then((response) => {
                    toastr.success(response.data.message)
                    this.dialogConfirm = false
                    const data = axios.get(store.state.domainName + 'cek-member-kadaluarsa')
                    store.commit('setDataMemberKadaluarsa', data.data)
                    router.go()
                })
                .catch((error) => {
                    toastr.error(error.data.message)
                })
        }
    }
}
</script>

<style scoped>
.gym-bg {
    background-image: url('@/assets/1087580.jpg');
    background-position: center;
    background-size: cover;
    width: 100%;
}

.container {
    align-items: center;
}

.images {
    background-image: url('@/assets/1633729.jpg');
    background-position: center;
    background-size: cover;
    width: 100%;
}

p {
    text-align: left;
}

td {
    text-align: left;
}

.card__wrapper {
    max-width: 400px;
}
</style>
