<template>
    <v-main class="container">
        <div>
            <v-card class="pa-8 gym-bg" width="1700">
                <h1 class="text-h3 text-center white--text font-weight-bold">Welcome, {{ nama }} </h1>
            </v-card>
            <v-spacer style="height: 30px;"></v-spacer>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" outlined hide details
                dense></v-text-field>
            <v-btn class="mx-2" fab dark color="indigo" @click="addFuntion">
                <v-icon dark>
                    mdi-account-plus
                </v-icon>
            </v-btn>
            <v-spacer style="height: 20px;"></v-spacer>
            <v-container fluid>
                <v-row>
                    <v-col v-for="(item, index) in filteredItems" :key="index" cols="6" sm="6" md="4" lg="3">
                        <v-card class="mx-auto" max-width="300" outlined>
                            <v-img :src="imageSrc" width="100%" height="200px" class="align-end">
                                <v-btn fab small color="white" class="mr-2" @click="editItem(item)">
                                    <v-icon small>mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn fab small color="white" @click="deleteItem(item)">
                                    <v-icon small>mdi-delete</v-icon>
                                </v-btn>
                            </v-img>
                            <v-card-title>
                                <span class="text-h5">{{ item.NAMA_KELAS }}</span>
                            </v-card-title>
                            <v-card-text style="text-align: left;">
                                <div> Harga : {{ item.HARGA_KELAS }}</div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </div>

        <v-dialog v-model="confirmAddUpdateDelete" persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark v-show="confirmDeleteTitle">Are You Sure To Delete This Jadwal?</v-toolbar>
                    <v-toolbar color="red" dark v-show="confirmAddTitle">Are You Sure To Add This Jadwal?</v-toolbar>
                    <v-toolbar color="red" dark v-show="confirmUpdateTitle">Are You Sure To Update This Jadwal?</v-toolbar>
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click="confirmAddUpdateDelete = false">NO</v-btn>
                    <v-btn color="red" text @click="deleteProcess" v-show="deleteConfirm">YES</v-btn>
                    <v-btn color="red" text @click="updateProcess" v-show="updateConfirm">YES</v-btn>
                    <v-btn color="red" text @click="addProcess" v-show="addConfirm">YES</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <v-dialog v-model="dialogAddEdit" persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark v-show="updateTitle">Edit Kelas</v-toolbar>
                    <v-toolbar color="red" dark v-show="addTitle">Add Kelas</v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field v-model="formKelas.nama_kelas" label="Class Name"
                            required></v-text-field>
                        <v-text-field v-model="formKelas.harga_kelas" label="Class Price"
                            required type="number"></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click="cancelAddEdit">Cancel</v-btn>
                    <v-btn color="blue" text @click="updateShow" v-show="updateButton">Save</v-btn>
                    <v-btn color="blue" text @click="addShow" v-show="addButton">Save</v-btn>
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
            nama: store.state.dataUser.data.NAMA_PEGAWAI,
            headers: [
                { text: 'Id Kelas', value: 'ID_KELAS' },
                { text: 'Nama Kelas', value: 'NAMA_KELAS' },
                { text: 'Harga Kelas', value: 'HARGA_KELAS' },
            ],
            dataKels: store.state.dataKelas.data,
            search: '',
            imageSrc: 'https://img-cdn.medkomtek.com/IL0eBVzHLNLbCy3ZfjjIKYi8eM8=/730x411/smart/filters:quality(75):strip_icc():format(webp)/article/EFTZmCwEkiBqMWeMi3yqN/original/1668121488-Manfaat%20Muay%20Thai.jpg',
            confirmAddUpdateDelete: false,
            confirmDeleteTitle: false,
            confirmAddTitle: false,
            confirmUpdateTitle: false,
            addConfirm: false,
            updateConfirm: false,
            deleteConfirm: false,
            deleteId: '',
            formKelas:{
                nama_kelas:'',
                harga_kelas:''
            },
            dialogAddEdit: false,
            addTitle: false,
            updateTitle: false,
            updateButton:false,
            addButton:false
        }
    },
    setup() {
        onMounted(async () => {
            const up = await axios.get(store.state.domainName + 'kelas')
            store.commit('setDataKelas', up.data)
        });
    },
    mounted() {
        setInterval(async () => {
            const up = await axios.get(store.state.domainName + 'kelas')
            store.commit('setDataKelas', up.data)
        }, 100000);
    },
    computed: {
        filteredItems() {
            return store.state.dataKelas.data.filter(item =>
                item.NAMA_KELAS.toLowerCase().includes(this.search.toLowerCase())
            );
        }
    },
    methods: {
        deleteItem(id) {
            this.confirmAddUpdateDelete = true
            this.confirmDeleteTitle = true
            this.deleteId = id.ID_KELAS
            this.confirmAddTitle = false
            this.confirmUpdateTitle = false
            this.addConfirm = false
            this.updateConfirm = false
            this.deleteConfirm = true
        },
        async deleteProcess() {
            const up = await axios.delete(store.state.domainName + 'kelas/' + this.deleteId)
                .then((response) => {
                    this.confirmAddUpdateDelete = false
                    this.confirmDeleteTitle = false
                    this.deleteId = ''
                    this.confirmAddTitle = false
                    this.confirmUpdateTitle = false
                    this.addConfirm = false
                    this.updateConfirm = false
                    this.deleteConfirm = false
                    toastr.success('Delete Jadwal Success', 'Success', setTimeout(() => {
                        location.reload()
                    }, 1000))
                }).catch((error) => {
                    toastr.error('Delete Jadwal Failed', 'Failed', setTimeout(() => {
                        location.reload()
                    }, 1000))
                })
        },
        addFuntion(){
            this.clearForm()
            this.dialogAddEdit = true
            this.addTitle = true
            this.updateTitle = false
            this.updateButton= false
            this.addButton = true
        },
        clearForm(){
            this.formKelas.harga_kelas = ''
            this.formKelas.nama_kelas = ''
        },
        addShow(){
            this.confirmAddUpdateDelete = true
            this.confirmDeleteTitle = false
            this.deleteId = ''
            this.confirmAddTitle = true
            this.confirmUpdateTitle = false
            this.addConfirm = true
            this.updateConfirm = false
            this.deleteConfirm = false
        },
        addProcess(){
            if(this.formKelas.nama_kelas == '' || this.formKelas.harga_kelas == ''){
                toastr.error('Please Fill All Form', 'Failed', setTimeout(() => {
                    location.reload()
                }, 1000))
            }else{
                const up = axios.post(store.state.domainName + 'kelas', this.formKelas)
                .then((response) => {
                    this.confirmAddUpdateDelete = false
                    this.confirmDeleteTitle = false
                    this.deleteId = ''
                    this.confirmAddTitle = false
                    this.confirmUpdateTitle = false
                    this.addConfirm = false
                    this.updateConfirm = false
                    this.deleteConfirm = false
                    this.dialogAddEdit = false
                    this.clearForm()
                    toastr.success('Add Kelas Success', 'Success', setTimeout(() => {
                        location.reload()
                    }, 1000))
                }).catch((error) => {
                    toastr.error('Add Kelas Failed', 'Failed', setTimeout(() => {
                        location.reload()
                    }, 1000))
                })
            }
        },
        editItem(item){
            this.dialogAddEdit = true
            this.addTitle = false
            this.updateTitle = true
            this.updateButton= true
            this.addButton = false
            this.formKelas.nama_kelas = item.NAMA_KELAS
            this.formKelas.harga_kelas = item.HARGA_KELAS
            this.formKelas.id_kelas = item.ID_KELAS
        },
        updateShow(){
            this.confirmAddUpdateDelete = true
            this.confirmDeleteTitle = false
            this.deleteId = ''
            this.confirmAddTitle = false
            this.confirmUpdateTitle = true
            this.addConfirm = false
            this.updateConfirm = true
            this.deleteConfirm = false
        },
        updateProcess(){
            if(this.formKelas.nama_kelas == '' || this.formKelas.harga_kelas == ''){
                toastr.error('Please Fill All Form', 'Failed', setTimeout(() => {
                    location.reload()
                }, 1000))
            }else{
                const up = axios.put(store.state.domainName + 'kelas/' + this.formKelas.id_kelas, this.formKelas)
                .then((response) => {
                    this.confirmAddUpdateDelete = false
                    this.confirmDeleteTitle = false
                    this.deleteId = ''
                    this.confirmAddTitle = false
                    this.confirmUpdateTitle = false
                    this.addConfirm = false
                    this.updateConfirm = false
                    this.deleteConfirm = false
                    this.dialogAddEdit = false
                    this.clearForm()
                    toastr.success('Update Kelas Success', 'Success', setTimeout(() => {
                        location.reload()
                    }, 1000))
                }).catch((error) => {
                    toastr.error('Update Kelas Failed', 'Failed', setTimeout(() => {
                        location.reload()
                    }, 1000))
                })
            }
        },
        cancelAddEdit(){
            this.dialogAddEdit = false
            this.clearForm()
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

