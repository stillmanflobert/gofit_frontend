<template>
    <v-main class="container">
        <v-card class="pa-8 gym-bg" width="1700">
            <h1 class="text-h3 text-center white--text font-weight-bold">Izin Instruktur </h1>
        </v-card>
        <v-spacer style="height: 30px;"></v-spacer>
        <v-data-table :headers="headers" :items="dataIzin">
            <template v-slot:item="{ item }">
                <tr>
                    <td>{{ item.nama_instruktur }}</td>
                    <td>{{ item.nama_instruktur_pengganti }}</td>
                    <td>{{ item.STATUS_IZIN }}</td>
                    <td>{{ item.KETERANGAN }}</td>
                    <td class="text-left">
                        <v-icon small class="mx-2" @click=" confirm(item)">mdi-dots-vertical</v-icon>
                    </td>
                </tr>
            </template>
        </v-data-table>

        <v-dialog v-model="dialogConfirm" persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark>Are You Sure To Confirm this instruktur?</v-toolbar>
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
                { text: 'nama instruktur', value: 'nama_instruktur' },
                { text: 'pengganti', value: 'nama_instruktur_pengganti' },
                { text: 'status izin', value: 'STATUS_IZIN' },
                { text: 'keterangan', value: 'KETERANGAN' },
                { text: 'action', value: 'action' }],
            dataIzin: store.state.izinInstruktur.data,
            idIzin: null,
            idJadwal: null,
            dialogConfirm: false,
        }
    },
    async mounted() {
        setInterval(async () => {
            const izin = await axios.get(store.state.domainName + 'izin-instruktur')
            store.commit('setDataIzinInstruktur', izin.data)
        }, 10000);
    },
    methods: {
        confirmProcces() {
            const data = {
                id: this.idIzin,
                id_jadwal_kelas: this.idJadwal
            }
            axios.put(store.state.domainName + 'konfirmasi-izin-instruktur', data
            ).then((res) => {
                toastr.success(res.data.message)
                this.dialogConfirm = false
                router.go()
            }).catch((err) => {
                toastr.error(err)
                console.log(err)
                console.log(data)
            })
        },
        confirm(item) {
            this.dialogConfirm = true
            this.idIzin = item.ID_IZIN_INTRUKSTUR
            this.idJadwal = item.ID_JADWAL_KELAS
        }
    },
    setup() {
        onMounted(async () => {
            const izin = await axios.get(store.state.domainName + 'izin-instruktur')
            store.commit('setDataIzinInstruktur', izin.data)
        })
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
