<template>
    <v-main class="container">
        <v-card class="pa-8 gym-bg" width="1700">
                <h1 class="text-h3 text-center white--text font-weight-bold">Jadwal Umum </h1>
        </v-card>
        <v-spacer style="height: 30px;"></v-spacer>
        <v-btn class="mx-2" fab dark color="indigo" @click="addFuntion">
                <v-icon dark>
                    mdi-calendar-plus
                </v-icon>
        </v-btn>
        <v-spacer style="height: 30px;"></v-spacer>
        <v-switch v-model="mode" :label="mode" :items="['Morning', 'Evening']" true-value="Morning"
            false-value="Evening"></v-switch>
        <v-row class="mt-4 mb-4">
            <v-col v-for="(day, index) in days" :key="index">
                <v-btn color="teal darken-1" dark rounded block @click="showSchedule(day)">{{ day }}</v-btn>
            </v-col>
        </v-row>
        <v-card v-if="selectedDay" class="mt-4">
            <v-card-title>
                {{ selectedDay }} {{ mode }}
                <v-btn icon @click="clearSelectedDay"><v-icon>mdi-arrow-left</v-icon></v-btn>
            </v-card-title>
            <v-row>
                <v-col cols="12" md="6" lg="4" v-for="(schedule, index) in filteredSchedules" :key="index">
                    <v-card class="mb-5">
                        <v-card-title class="mt-3">
                            <h2 class="headline font-weight-bold mb-0">{{ schedule.nama_kelas }}</h2>
                            <p class="subtitle-1">{{ schedule.SESI_JADWAL_DEFAULT }}</p>
                        </v-card-title>
                        <v-card-text>
                            <p class="mb-0">Instructor: {{ schedule.nama_instruktur }}</p>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn color="primary" text @click="editSchedule(schedule)">
                                Edit
                            </v-btn>
                            <v-btn color="error" text @click="deleteSchedule(schedule.ID_JADWAL_DEFAULT)">
                                Delete
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-card>

        <v-dialog v-model=" dialogDelete " persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark>Are You Sure To Delete This Jadwal?</v-toolbar>
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click=" dialogDelete = false ">NO</v-btn>
                    <v-btn color="red" text @click=" deleteProcces ">YES</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model=" dialogAddEdit " persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark v-show=" updateTitle ">Edit Jadwal</v-toolbar>
                    <v-toolbar color="red" dark v-show=" addTitle ">Add Jadwal</v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-select v-model="formJadwal.nama_instruktur" label="Instruktur Name" :items="instruktur" item-text="NAMA_INSTRUKTUR" item-value="ID_INSTRUKTUR"></v-select>
                        <v-select v-model=" formJadwal.nama_kelas" label="Class Name" :items="kelas" item-text="NAMA_KELAS" item-value="ID_KELAS"></v-select>
                        <v-select v-model="formJadwal.HARI_JADWAL_DEFAULT" :items="days" label="Select days"></v-select>
                        <v-select v-model="formJadwal.SESI_JADWAL_DEFAULT" :items="times" type="time" label="Select Time"></v-select>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click=" cancelAddEdit ">Cancel</v-btn>
                    <v-btn color="blue" text @click=" updateShow " v-show=" updateButton ">Save</v-btn>
                    <v-btn color="blue" text @click=" addShow " v-show=" addButton ">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <v-dialog v-model=" confirmAddUpdate " persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark v-show="confirmAddTitle">Are You Sure To Add This Jadwal?</v-toolbar>
                    <v-toolbar color="red" dark v-show="confirmUpdateTitle">Are You Sure To Update This Jadwal?</v-toolbar>
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click=" confirmAddUpdate = false ">NO</v-btn>
                    <v-btn color="red" text @click=" updateProcess " v-show="updateConfirm">YES</v-btn>
                    <v-btn color="red" text @click=" addProcess " v-show="addConfirm">YES</v-btn>
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
            instruktur: store.state.dataInstruktur.data,
            kelas: store.state.dataKelas.data,
            times:['08:00:00', '09:30:00', '17:00:00', '18:30:00'],
            selectedDay: null,
            mode: 'Morning',
            schedules: store.state.dataJadwalUmum.data,
            dialogDelete: false,
            formJadwal:{
                nama_kelas: '',
                nama_instruktur: '',
                HARI_JADWAL_DEFAULT: '',
                SESI_JADWAL_DEFAULT: '',
            },
            idJadwal: '',
            dialogAddEdit: false,
            updateTitle: false,
            addTitle: false,
            updateButton: false,
            addButton: false,
            idDelete: null,
            confirmAddUpdate: false,
            updateConfirm: false,
            addConfirm: false,
            cancelAddUpdate: true,
            confirmAddTitle: false,
            confirmUpdateTitle: false,
        }
    },
    computed: {
        filteredSchedules() {
            if (this.selectedDay) {
                return this.schedules.filter(schedule => {
                    if (this.mode === 'Morning') {
                        return schedule.SESI_JADWAL_DEFAULT <= '12:00' && schedule.HARI_JADWAL_DEFAULT === this.selectedDay;
                    } else {
                        return schedule.SESI_JADWAL_DEFAULT > '12:00' &&
                        schedule.HARI_JADWAL_DEFAULT === this.selectedDay;
                    }
                });
            } else {
                return [];
            }
        },
    },
    methods: {
        showSchedule(day) {
            this.selectedDay = day;
        },
        clearSelectedDay() {
            this.selectedDay = null;
        },
        editSchedule(schedule) {
            this.dialogAddEdit = true;
            this.updateTitle = true;
            this.addTitle = false;
            this.updateButton = true;
            this.addButton = false;
            this.formJadwal.nama_kelas = schedule.ID_KELAS;
            this.formJadwal.nama_instruktur = schedule.ID_INSTRUKTUR;
            this.formJadwal.HARI_JADWAL_DEFAULT = schedule.HARI_JADWAL_DEFAULT;
            this.formJadwal.SESI_JADWAL_DEFAULT = schedule.SESI_JADWAL_DEFAULT;
            this.idJadwal = schedule.ID_JADWAL_DEFAULT;
        },
        deleteSchedule(schedule) {
            this.dialogDelete = true;
            this.idDelete = schedule;
        },
        addFuntion() {
            this.addTitle = true;
            this.updateTitle = false;
            this.addButton = true;
            this.updateButton = false;
            this.dialogAddEdit = true;
        },
        clearForm() {
            this.formJadwal.nama_kelas = '';
            this.formJadwal.nama_instruktur = '';
            this.formJadwal.HARI_JADWAL_DEFAULT = '';
            this.formJadwal.SESI_JADWAL_DEFAULT = '';
        },
        cancelAddEdit() {
            this.dialogAddEdit = false;
            this.clearForm();
        },
        async deleteProcces(){
            const del = await axios.delete(store.state.domainName + 'jadwal-default/' + this.idDelete)
            .then(async(response) => {
                this.dialogDelete = false;
                toastr.success('Jadwal Deleted')
                const jadwal = await axios.get(store.state.domainName + 'jadwal-default');
                store.commit('setDataJadwalUmum', jadwal.data);
                router.go();
            }).catch((error) => {
                toastr.error('Jadwal Deleted error', 'Error', {timeOut: 5000})
            });
        },
        addShow() {
            this.addConfirm = true;
            this.updateConfirm = false;
            this.confirmAddUpdate = true;
            this.confirmAddTitle = true;
            this.confirmUpdateTitle = false;
        },
        async addProcess() {
            if(this.formJadwal.nama_kelas == '' || this.formJadwal.nama_instruktur == '' || this.formJadwal.HARI_JADWAL_DEFAULT == '' || this.formJadwal.SESI_JADWAL_DEFAULT == ''){
                toastr.error('Please fill all form', 'Error', {timeOut: 5000})
                }else{
                    const addJadwal = {
                'id_instruktur' : this.formJadwal.nama_instruktur,
                'id_kelas' :this.formJadwal.nama_kelas,
                'hari_jadwal_default':this.formJadwal.HARI_JADWAL_DEFAULT,
                'sesi_jadwal_default' : this.formJadwal.SESI_JADWAL_DEFAULT,
            }
            const add = await axios.post(store.state.domainName + 'jadwal-default', addJadwal)
            .then(async(response) => {
                this.dialogAddEdit = false;
                this.clearForm();
                toastr.success('Jadwal Added')
                const jadwal = await axios.get(store.state.domainName + 'jadwal-default');
                store.commit('setDataJadwalUmum', jadwal.data);
                router.go();
            }).catch((error) => {
                toastr.error('instructor schedule collided', 'Error', {timeOut: 5000})
                console.log(error)
                console.log(this.formJadwal)
            });
                }
        },
        updateShow() {
            this.updateConfirm = true;
            this.addConfirm = false;
            this.confirmAddUpdate = true;
            this.confirmAddTitle = false;
            this.confirmUpdateTitle = true;
        },
        async updateProcess() {
            if(this.formJadwal.nama_kelas == '' || this.formJadwal.nama_instruktur == '' || this.formJadwal.HARI_JADWAL_DEFAULT == '' || this.formJadwal.SESI_JADWAL_DEFAULT == ''){
                toastr.error('Please fill all form', 'Error', {timeOut: 5000})
                }else{
                    const updateJadwal = {
                'id_instruktur' : this.formJadwal.nama_instruktur,
                'id_kelas' :this.formJadwal.nama_kelas,
                'hari_jadwal_default':this.formJadwal.HARI_JADWAL_DEFAULT,
                'sesi_jadwal_default' : this.formJadwal.SESI_JADWAL_DEFAULT,
            }
            const update = await axios.put(store.state.domainName + 'jadwal-default/' + this.idJadwal, updateJadwal)
            .then(async(response) => {
                this.dialogAddEdit = false;
                this.clearForm();
                toastr.success('Jadwal Updated',{timeOut: 5000})
                const jadwal = await axios.get(store.state.domainName + 'jadwal-default');
                store.commit('setDataJadwalUmum', jadwal.data);
                router.go();
            }).catch((error) => {
                toastr.error('instructor schedule collided', 'Error', {timeOut: 5000})
                console.log(error)
                console.log(this.formJadwal)
            });
                }
        },
    },
    setup() {
        onMounted(async() => {
            const dataJadwalUmum = await axios.get(store.state.domainName + 'jadwal-default');
            const dataInstruktur = await axios.get(store.state.domainName + 'instruktur');
            const dataKelas = await axios.get(store.state.domainName + 'kelas');
            store.commit('setDataJadwalUmum', dataJadwalUmum.data);
            store.commit('setDataInstruktur', dataInstruktur.data);
            store.commit('setDataKelas', dataKelas.data);
        });
    },
    mounted() {
        setInterval(async() => {
            const dataJadwalUmum = await axios.get(store.state.domainName + 'jadwal-default');
            const dataInstruktur = await axios.get(store.state.domainName + 'instruktur');
            const dataKelas = await axios.get(store.state.domainName + 'kelas');
            store.commit('setDataJadwalUmum', dataJadwalUmum.data);
            store.commit('setDataInstruktur', dataInstruktur.data);
            store.commit('setDataKelas', dataKelas.data);
        }, 10000);
    },
};
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
