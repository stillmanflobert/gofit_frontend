<template>
    <v-main class="container">
        <v-card class="pa-8 gym-bg" width="1700">
            <h1 class="text-h3 text-center white--text font-weight-bold">Presensi Kelas </h1>
        </v-card>
        <v-spacer style="height: 30px;"></v-spacer>
        <v-spacer style="height: 30px;"></v-spacer>
        <v-data-table :headers="headers" :items="dataPresensi">
            <template v-slot:item="{ item }">
                <tr>
                    <td>{{ item.id_member }}</td>
                    <td>{{ item.nama_member }}</td>
                    <td>{{ item.nama_kelas }}</td>
                    <td>{{ item.waktu_presensi_member_kelas }}</td>
                    <td>{{ item.hari_jadwal_default }}</td>
                    <td>{{ item.sesi_jadwal_default }}</td>
                    <td class="text-center">
                        <v-icon small class="mx-2" @click="confirmDialog = true; idPresensiKelas = item.id_presensi_kelas">mdi-dots-vertical</v-icon>
                    </td>
                </tr>
            </template>
        </v-data-table>


        <v-dialog v-model=" confirmDialog " persistent max-width="600px" style="z-index: 1000;">
                <v-card>
                    <v-card-title class="text-h5 red lighten-2">
                        <v-toolbar color="red" dark>Are You Sure To print this struck?</v-toolbar>
                    </v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red" text @click=" confirmDialog = false ">NO</v-btn>
                        <v-btn color="red" text @click="cetakProses">YES</v-btn>
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
            days: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
            session: [1, 2, 3, 4, 5, 6, 7],
            headers: [
                { text: 'ID', value: 'id_member' },
                { text: 'Nama', value: 'nama_member' },
                { text: 'Nama kelas', value: 'nama_kelas'},
                { text: 'Waktu persensi', value: 'waaktu_presensi_member_kelas' },
                { text: 'Hari', value: 'hari_jadwal_default' },
                { text: 'Sesi Gym', value: 'sesi_gym' },
                {text: 'Action', value: 'action'}
            ],
            dataPresensi: store.state.presensiKelas.data,
            idPresensi: null,
            confirmDialog: false,
            idPresensiKelas: null,
        }
    },
    setup() {
        onMounted(async () => {
            const data = await axios.get(store.state.domainName + 'presensi-member-kelas')
            const member = await axios.get(store.state.domainName + 'member')
            store.commit('setDataPresensiKelas', data.data)
            store.commit('setDataMember', member.data)
        })
    },
    mounted() {
        setInterval(async () => {
            const data = await axios.get(store.state.domainName + 'presensi-member-kelas')
            const member = await axios.get(store.state.domainName + 'member')
            store.commit('setDataPresensiKelas', data.data)
            store.commit('setDataMember', member.data)
        }, 10000)
    },
    methods: {
        cetakProses() {
            window.open(store.state.domainName + 'cetak-presensi-kelas/' + this.idPresensiKelas)
            router.go()
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
