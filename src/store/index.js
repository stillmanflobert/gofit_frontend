import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        domainName: 'https://system23.site/api/',
        dataUser: null,
        loginInfo: null,
        dataPromo: null,
        dataPegawai: null,
        dataInstruktur: null,
        dataMember: null,
        dataKelas: null,
        dataJadwalUmum: null,
        dataJadwalHarian: null,
        izinInstruktur: null,
        memberKadaluarsa: null,
        kelasKadaluarsa: null,
        presensiGym: null,
        presensiKelas: null,
        dataGrafik: null,
    },
    mutations: {
        setDataUser(state, payload) {
            state.dataUser = payload;
        },
        setLoginInfo(state, payload) {
            state.loginInfo = payload;
        },
        setDataPromo(state, payload) {
            state.dataPromo = payload;
        },
        setDataPegawai(state, payload) {
            state.dataPegawai = payload;
        },
        setDataInstruktur(state, payload) {
            state.dataInstruktur = payload;
        },
        setDataMember(state, payload) {
            state.dataMember = payload;
        },
        setDataKelas(state, payload) {
            state.dataKelas = payload;
        },
        setDataJadwalUmum(state, payload) {
            state.dataJadwalUmum = payload;
        },
        setDataJadwalHarian(state, payload) {
            state.dataJadwalHarian = payload;
        },
        setDataIzinInstruktur(state, payload) {
            state.izinInstruktur = payload;
        },
        setDataMemberKadaluarsa(state, payload) {
            state.memberKadaluarsa = payload;
        },
        setDataKelasKadaluarsa(state, payload) {
            state.kelasKadaluarsa = payload;
        },
        setDataPresensiGym(state, payload) {
            state.presensiGym = payload;
        },
        setDataPresensiKelas(state, payload) {
            state.presensiKelas = payload;
        },
        setDataGrafik(state, payload) {
            state.dataGrafik = payload;
        }
    },
    actions: {
        // actions
    },
    getters: {
        //ambil data domainName dari state
    },
    plugins: [createPersistedState()],
})

export default store
