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
        <v-data-table :headers="headers" :items="dataKelas">
            <template v-slot:item="{ item }">
                <tr @click="dialogProcess(item.ID_MEMBER); formProcess(item);">
                    <td>{{ item.ID_MEMBER }}</td>
                    <td>{{ item.nama_member }}</td>
                    <td>{{ item.nama_kelas }}</td>
                    <td>{{ item.TGL_KADALUARSA }}</td>
                </tr>
            </template>
        </v-data-table>

        <v-dialog v-model="dialogConfirm" persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark>Are You Sure To deactivated all of this Kelas?</v-toolbar>
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
                { text: 'Nama', value: 'nama_member' },
                { text: 'Nama Kelas', value: 'nama_kelas' },
                { text: 'tanggal Kadaluarsa', value: 'TGL_KADALUARSA' },
            ],
            dataKelas: store.state.kelasKadaluarsa.data,
            dialogConfirm: false,
        }
    },
    setup() {
        onMounted(async () => {
            const member = await axios.get(store.state.domainName + 'kelas-kadaluarsa')
            store.commit('setDataKelasKadaluarsa', member.data)
        })
    },
    async mounted() {
        setInterval(() => {
            const data = axios.get(store.state.domainName + 'kelas-kadaluarsa')
            store.commit('setDataKelasKadaluarsa', data.data)
        }, 10000)
    },
    methods: {
        async confirmProcces() {
            axios.post(store.state.domainName + 'deactivated-kelas')
                .then((response) => {
                    toastr.success(response.data.message,setTimeout(() => {
                        this.dialogConfirm = false
                        const data = axios.get(store.state.domainName + 'kelas-kadaluarsa')
                        store.commit('setDataKelasKadaluarsa', data.data)
                        router.go()
                    }, 2000))
                    // this.dialogConfirm = false
                    // const data = axios.get(store.state.domainName + 'kelas-kadaluarsa')
                    // store.commit('setDataKelasKadaluarsa', data.data)
                    // router.go()
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
