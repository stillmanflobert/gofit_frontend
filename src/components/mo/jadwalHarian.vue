<template>
  <v-main class="container">
    <v-card class="pa-8 gym-bg" width="1700">
      <h1 class="text-h3 text-center white--text font-weight-bold">Jadwal Harian </h1>
    </v-card>
    <v-spacer style="height: 30px;"></v-spacer>
    <v-btn class="mx-2" fab dark color="indigo" @click="showJadwal = true; showSearch = false">
      <v-icon dark>
        mdi-clipboard-text
      </v-icon>
    </v-btn>
    <v-btn class="mx-2" fab dark color="indigo" @click=" generateFuntion ">
      <v-icon dark>
        mdi-plus-outline
      </v-icon>
    </v-btn>
    <v-btn class="mx-2" fab dark color="indigo" @click=" showJadwal = false; showSearch = true ">
      <v-icon dark>
        mdi-magnify
      </v-icon>
    </v-btn>
    <v-spacer style="height: 30px;"></v-spacer>
    <v-main v-show=" showJadwal ">
      <v-switch v-model=" mode " :label=" mode " :items=" ['Morning', 'Evening'] " true-value="Morning"
        false-value="Evening"></v-switch>
      <v-row class="mt-4 mb-4">
        <v-col v-for="( day, index ) in  days " :key=" index ">
          <v-btn color="teal darken-1" dark rounded block @click=" showSchedule(day) ">{{ day }}</v-btn>
        </v-col>
      </v-row>
      <v-card v-if=" selectedDay " class="mt-4">
        <v-card-title>
          {{ selectedDay }} {{ mode }}
          <v-btn icon @click=" clearSelectedDay "><v-icon>mdi-arrow-left</v-icon></v-btn>
        </v-card-title>
        <v-row>
          <v-col cols="12" md="6" lg="4" v-for="( schedule, index ) in  filteredSchedules " :key=" index ">
            <v-card class="mb-5">
              <v-card-title class="mt-3">
                <h2 class="headline font-weight-bold mb-0">{{ schedule.nama_kelas }}</h2>
                <p class="subtitle-1">{{ schedule.sesi_jadwal_default }} / {{ schedule.TANGGAL }}</p>
              </v-card-title>
              <v-card-text>
                <p class="mb-0">Instructor: {{ schedule.nama_instruktur }}</p>
              </v-card-text>
              <v-card-text v-if=" schedule.STATUS == 0 ">
                <p class="mb-0"><strong>(KELAS DILIBURKAN)</strong></p>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" text @click=" addSchedule(schedule); confirmChange = true "
                  :disabled=" schedule.STATUS == 0 ">
                  Change Schedule
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card>

      <v-dialog v-model=" confirmChange " persistent max-width="600px" style="z-index: 1000;">
        <v-card>
          <v-card-title class="text-h5 red lighten-2">
            <v-toolbar color="red" dark>Are You Sure To Cancel This Jadwal?</v-toolbar>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" text @click=" confirmChange = false; schedule = null ">NO</v-btn>
            <v-btn color="red" text @click=" editSchedule ">YES</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>

    <v-main v-show=" showSearch ">
      <v-text-field v-model=" search " append-icon="mdi-magnify" label="Search" outlined hide details dense></v-text-field>


      <v-row>
        <v-col cols="12" md="6" lg="4" v-for="( schedule, index ) in  filteredSchedulesSearch " :key=" index ">
          <v-card class="mb-5">
            <v-card-title class="mt-3">
              <h2 class="headline font-weight-bold mb-0">{{ schedule.nama_kelas }}</h2>
              <p class="subtitle-1">{{ schedule.sesi_jadwal_default }} / {{ schedule.TANGGAL }}</p>
            </v-card-title>
            <v-card-text>
              <p class="mb-0">Instructor: {{ schedule.nama_instruktur }}</p>
            </v-card-text>
            <v-card-text v-if=" schedule.STATUS == 0 ">
              <p class="mb-0"><strong>(KELAS DILIBURKAN)</strong></p>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" text @click=" addSchedule(schedule); confirmChange = true "
                :disabled=" schedule.STATUS == 0 ">
                Change Schedule
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-main>
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
      times: ['08:00:00', '09:30:00', '17:00:00', '18:30:00'],
      selectedDay: null,
      mode: 'Morning',
      schedules: store.state.dataJadwalHarian.data,
      dialogDelete: false,
      formJadwal: {
        nama_kelas: '',
        nama_instruktur: '',
        HARI_JADWAL_DEFAULT: '',
        SESI_JADWAL_DEFAULT: '',
      },
      idJadwal: '',
      showJadwal: false,
      confirmChange: false,
      schedule: null,
      showSearch: false,
      search: '',
    }
  },
  computed: {
    filteredSchedules() {
      if (this.selectedDay) {
        return this.schedules.filter(schedule => {
          if (this.mode === 'Morning') {
            return schedule.sesi_jadwal_default <= '12:00' && schedule.hari_jadwal_default === this.selectedDay;
          } else {
            return schedule.sesi_jadwal_default > '12:00' &&
              schedule.hari_jadwal_default === this.selectedDay;
          }
        });
      } else {
        return [];
      }
    },
    filteredSchedulesSearch() {
      if(this.search == ''){
        return []
      }else{
        return store.state.dataJadwalHarian.data.filter(item =>
                item.nama_kelas.toLowerCase().includes(this.search.toLowerCase())
            );
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
    async updateProcess() {
      if (this.formJadwal.nama_kelas == '' || this.formJadwal.nama_instruktur == '' || this.formJadwal.HARI_JADWAL_DEFAULT == '' || this.formJadwal.SESI_JADWAL_DEFAULT == '') {
        toastr.error('Please fill all form', 'Error', { timeOut: 5000 })
      } else {
        const updateJadwal = {
          'id_instruktur': this.formJadwal.nama_instruktur,
          'id_kelas': this.formJadwal.nama_kelas,
          'hari_jadwal_default': this.formJadwal.HARI_JADWAL_DEFAULT,
          'sesi_jadwal_default': this.formJadwal.SESI_JADWAL_DEFAULT,
        }
        const update = await axios.put(store.state.domainName + 'jadwal-default/' + this.idJadwal, updateJadwal)
          .then(async (response) => {
            this.dialogAddEdit = false;
            this.clearForm();
            toastr.success('Jadwal Updated', { timeOut: 5000 })
            const jadwal = await axios.get(store.state.domainName + 'jadwal-default');
            store.commit('setDataJadwalUmum', jadwal.data);
            router.go();
          }).catch((error) => {
            toastr.error('instructor schedule collided', 'Error', { timeOut: 5000 })
            console.log(error)
            console.log(this.formJadwal)
          });
      }
    },
    async generateFuntion() {
      const generate = await axios.post(store.state.domainName + 'generate-jadwal-harian')
        .then(async (response) => {

          const jadwal = await axios.get(store.state.domainName + 'jadwal-default');
          store.commit('setDataJadwalUmum', jadwal.data);
          toastr.success('Jadwal Generated', setTimeout(() => {
            router.go();
          }, 1000))
        }).catch((error) => {
          toastr.error('Jadwal already generated', 'Error', { timeOut: 1000 })
          console.log(error)
        });
    },
    addSchedule(schedule) {
      this.schedule = schedule
    },
    async editSchedule() {
      const up = await axios.put(store.state.domainName + 'jadwal-harian/' + this.schedule.ID_JADWAL_KELAS)
        .then(async (response) => {
          const jadwal = await axios.get(store.state.domainName + 'jadwal-harian');
          store.commit('setDataJadwalUmum', jadwal.data);
          toastr.success('Jadwal Changed', setTimeout(() => {
            router.go();
          }, 3000))
        }).catch((error) => {
          console.log(error)
        });
    },
  },
  setup() {
    onMounted(async () => {
      const dataJadwalUmum = await axios.get(store.state.domainName + 'jadwal-harian');
      const dataInstruktur = await axios.get(store.state.domainName + 'instruktur');
      const dataKelas = await axios.get(store.state.domainName + 'kelas');
      store.commit('setDataJadwalHarian', dataJadwalUmum.data);
      store.commit('setDataInstruktur', dataInstruktur.data);
      store.commit('setDataKelas', dataKelas.data);
    });
  },
  mounted() {
    setInterval(async () => {
      const dataJadwalHarian = await axios.get(store.state.domainName + 'jadwal-harian');
      const dataInstruktur = await axios.get(store.state.domainName + 'instruktur');
      const dataKelas = await axios.get(store.state.domainName + 'kelas');
      store.commit('setDataJadwalHarian', dataJadwalHarian.data);
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
