<template>
    <v-main class="container">
        <v-card class="pa-8 gym-bg" width="1700">
            <h1 class="text-h3 text-center white--text font-weight-bold">Laporan </h1>
        </v-card>
        <v-spacer style="height: 30px;"></v-spacer>
        <v-row>
            <v-col cols="3">
                <v-btn color="teal darken-1" dark rounded block @click="processCetakAktivasiUang">Aktivasi & Uang</v-btn>
            </v-col>
            <v-col cols="3">
                <v-btn color="teal darken-1" dark rounded block @click="processDepoKelas">Depo Kelas</v-btn>
            </v-col>
            <v-col cols="3">
                <v-btn color="teal darken-1" dark rounded block @click="processAktivitasGym">Aktivitas Gym</v-btn>
            </v-col>
            <v-col cols="3">
                <v-btn color="teal darken-1" dark rounded block @click="processKinerjaInstruktur">Kinerja Instruktur</v-btn>
            </v-col>
        </v-row>

        <!-- Diagram Batang -->
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title>Grafik Data Gym</v-card-title>
                    <v-card-text>
                        <apexchart :options="chartOptions" :series="chartSeries" type="bar" width="100%"></apexchart>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-main>
</template>

<script>
import axios from 'axios';
import router from '@/router';
import store from '@/store/index';
import VueApexCharts from 'vue-apexcharts';
import { ref, onMounted } from 'vue';

export default {
    components: {
        apexchart: VueApexCharts,
    },
    data() {
        return {
            chartOptions: {
                chart: {
                    type: 'bar',
                },
                xaxis: {
                    categories: ['Januari', 'Februai', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'Nopember', 'Desember'],
                },
            },
            chartSeries: [
                {
                    name: 'Total Aktivasi dan Deposit Uang',
                    // data: [30, 40, 45, 50, 20, 70, 80, 90, 100, 110, 120, 13],
                    data: Object.values(store.state.dataGrafik.data) ,

                },
            ],
        };
    },
    methods: {
        processCetakAktivasiUang() {
            window.open(store.state.domainName + 'laporan-aktivasi-deposit');
        },
        processDepoKelas() {
            window.open(store.state.domainName + 'cetak-laporan-kelas');
        },
        processAktivitasGym() {
            window.open(store.state.domainName + 'laporan-gym');
        },
        processKinerjaInstruktur() {
            window.open(store.state.domainName + 'cetak-laporan-instruktur');
        },
    },
    setup() {
        onMounted(async () => {
            const response = await axios.get(store.state.domainName + 'data-grapik');
            store.commit('setDataGrafik', response.data);
            console.log(response.data);
        });
    },
    mounted(){
        setInterval(async() => {
            const response = await axios.get(store.state.domainName + 'data-grapik');
            store.commit('setDataGrafik', response.data);
        }, 10000);
    }

};
</script>

<style>
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
