<template>
    <v-main class="container">
        <v-card class="pa-8 gym-bg" width="1700">
            <h1 class="text-h3 text-center white--text font-weight-bold">Presnsi Gym </h1>
        </v-card>
        <v-spacer style="height: 30px;"></v-spacer>
        <v-btn class="mx-2" fab dark color="indigo" @click="addDialog = true">
            <v-icon dark>
                mdi-account-plus
            </v-icon>
        </v-btn>
        <v-spacer style="height: 30px;"></v-spacer>
        <v-data-table :headers="headers" :items="dataPresensi">
            <template v-slot:item="{ item }">
                <tr>
                    <td>{{ item.id_member }}</td>
                    <td>{{ item.nama_member }}</td>
                    <td>{{ item.waktu_presensi_member_gym }}</td>
                    <td>{{ item.hari_gym }}</td>
                    <td>{{ item.sesi_gym }}</td>
                    <td>{{ item.EMAIL }}</td>
                </tr>
            </template>
        </v-data-table>

        <!-- add dialog -->
        <v-dialog v-model="addDialog" persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark>Add Presensi Gym</v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-select v-model="formPresensi.id_member" label="Member Name" :items="member"
                            item-text="NAMA_MEMBER" item-value="ID_MEMBER"></v-select>
                        <v-select v-model="formPresensi.hari_gym" label="Choose days" :items=days></v-select>
                        <v-select v-model="formPresensi.sesi_gym" label="Choose session" :items=session></v-select>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click=" addDialog = false">Cancel</v-btn>
                    <v-btn color="blue" text @click="addProcess">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- add dialog -->
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
                { text: 'Waktu persensi', value: 'waaktu_presensi_member_gym' },
                { text: 'Hari', value: 'hari_gym' },
                { text: 'Sesi Gym', value: 'sesi_gym' },
            ],
            dataPresensi: store.state.presensiGym.data,
            addDialog: false,
            member: store.state.dataMember.data,
            formPresensi: {
                id_member: '',
                hari_gym: '',
                sesi_gym: '',
            },
            idPresensi: null,
        }
    },
    setup() {
        onMounted(async () => {
            const data = await axios.get(store.state.domainName + 'presensi-member-gym')
            const member = await axios.get(store.state.domainName + 'member')
            store.commit('setDataPresensiGym', data.data)
            store.commit('setDataMember', member.data)
        })
    },
    mounted() {
        setInterval(async () => {
            const data = await axios.get(store.state.domainName + 'presensi-member-gym')
            const member = await axios.get(store.state.domainName + 'member')
            store.commit('setDataPresensiGym', data.data)
            store.commit('setDataMember', member.data)
        }, 10000)
    },
    methods: {
        async addProcess() {
            if (this.formPresensi.id_member == '' || this.formPresensi.hari_gym == '' || this.formPresensi.sesi_gym == '') {
                toastr.error('Data tidak boleh kosong')
            } else {
                const data = await axios.post(store.state.domainName + 'presensi-member-gym', this.formPresensi)
                    .then(async (response) => {
                        toastr.success('Data berhasil ditambahkan', 'Success', { timeOut: 3000 })
                        const data = await axios.get(store.state.domainName + 'presensi-member-gym')
                        store.commit('setDataPresensiGym', data.data)
                        this.addDialog = false
                        window.open(store.state.domainName + 'cetak-presensi-gym/' + response.data.data.id_presensi_gym)
                        router.go()
                    })
                    .catch((error) => {
                        toastr.error('Data gagal ditambahkan', 'Error', { timeOut: 3000 })
                    })

            }
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
