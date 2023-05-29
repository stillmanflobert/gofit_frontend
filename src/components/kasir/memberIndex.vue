<template>
    <v-main class="container">
        <div>
            <v-card class="pa-8 gym-bg" width="1700">
                <h1 class="text-h3 text-center white--text font-weight-bold">Welcome, {{ nama }} </h1>
            </v-card>
        </div>
        <v-spacer style="height: 30px;"></v-spacer>
        <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" outlined hide details></v-text-field>
        <v-btn class="mx-2" fab dark color="indigo" @click="addFuntion">
            <v-icon dark>
                mdi-account-plus
            </v-icon>
        </v-btn>
        <v-spacer style="height: 20px;"></v-spacer>
        <v-data-table :headers="headers" :items="dataMember" :search="search">
            <template v-slot:item="{ item }">
                <tr @click="dialogProcess(item.ID_MEMBER); formProcess(item);">
                    <td>{{ item.ID_MEMBER }}</td>
                    <td>{{ item.NAMA_MEMBER }}</td>
                    <td>{{ item.ALAMAT_MEMBER }}</td>
                    <td>{{ item.TELEPON_MEMBER}}</td>
                    <td>{{ item.JUMLAH_DEPOSIT_UANG}}</td>
                    <td>{{ item.EMAIL }}</td>
                    <td v-if=" item.STATUS == 1 ">Aktif</td>
                    <td v-else>Non Aktif</td>
                    <td class="text-center">
                        <v-icon small class="mx-2"
                            @click=" dialogProcess(item.ID_MEMBER); formProcess(item); ">mdi-dots-vertical</v-icon>
                    </td>
                </tr>
            </template>
        </v-data-table>
        <v-dialog v-model=" dialog " max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark>What Action You Wanna Choose</v-toolbar>
                </v-card-title>
                <v-spacer style="height: 10px;"></v-spacer>
                <v-btn color="red" text @click=" dialogDelete = true " style="align-items: center;">Delete</v-btn>
                <v-btn color="blue" text @click=" updateFuntion " class="button">Edit</v-btn>
                <v-btn color="green" text @click=" showMemberCard " class="button">Card</v-btn>
                <v-btn color="orange" text @click=" dialogReset = true " class="button">Reset</v-btn>
                <v-btn color="secondary" text @click=" dialogAktivasi = true " class="button"
                    :disabled=" status == 1 ">Aktivasi</v-btn>
                <v-btn color="warning" text @click=" dialogTambahDepositUang = true " class="button"
                    :disabled=" status == 0 ">Uang</v-btn>
                <v-btn color="info" text @click=" dialogTambahDepositKelas= true " class="button"
                    :disabled=" status == 0 ">Kelas</v-btn>
                <v-spacer style="height: 10px;"></v-spacer>
            </v-card>
            <v-dialog v-model=" dialogDelete " persistent max-width="600px" style="z-index: 1000;">
                <v-card>
                    <v-card-title class="text-h5 red lighten-2">
                        <v-toolbar color="red" dark>Are You Sure To Delete This Member?</v-toolbar>
                    </v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red" text @click=" dialogDelete = false ">NO</v-btn>
                        <v-btn color="red" text @click=" deleteProcces ">YES</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-dialog>

        <v-dialog v-model=" dialogAddEdit " persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark v-show=" updateTitle ">Edit Member</v-toolbar>
                    <v-toolbar color="red" dark v-show=" addTitle ">Add Member</v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field v-model=" formMember.NAMA_MEMBER " label="Member Name" required></v-text-field>
                        <v-text-field v-model=" formMember.ALAMAT_MEMBER " label="Address" required></v-text-field>
                        <v-text-field v-model=" formMember.TELEPON_MEMBER " label="Phone Number" required
                            type="number"></v-text-field>
                        <v-text-field v-model=" formMember.EMAIL " label="Email" required type="email"></v-text-field>
                        <v-dialog v-model=" modal " persistent width="290px">
                            <template v-slot:activator=" { on } ">
                                <v-text-field v-model=" formMember.TANGGAL_LAHIR " label="Birth Date"
                                    prepend-icon="mdi-calendar" v-on=" on " required></v-text-field>
                            </template>
                            <v-date-picker v-model=" formMember.TANGGAL_LAHIR " scrollable required>
                                <v-spacer></v-spacer>
                                <v-btn text color="primary" @click=" modal = false ">
                                    Cancel
                                </v-btn>
                                <v-btn text color="primary" @click=" modal = false ">
                                    OK
                                </v-btn>
                            </v-date-picker>
                        </v-dialog>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click=" cancelAddEdit ">Cancel</v-btn>
                    <v-btn color="blue" text @click=" updateShows " v-show=" updateButton ">Save</v-btn>
                    <v-btn color="blue" text @click=" addShows " v-show=" addShow ">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <v-dialog v-model=" dialogAddUpdate " persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark v-show=" addConfirmTitle ">Are You Sure To Add This Member?</v-toolbar>
                    <v-toolbar color="red" dark v-show=" updateConfirmTitle ">Are You Sure To Update This
                        Member?</v-toolbar>
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click=" dialogAddUpdate = false ">NO</v-btn>
                    <v-btn color="red" text @click=" addProcess " v-show=" addBtn ">YES</v-btn>
                    <v-btn color="red" text @click=" updateProcess " v-show=" updateBtn ">YES</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model=" dialogReset " persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark>Are You Sure To Reset Password This Member?</v-toolbar>
                </v-card-title>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click=" dialogReset = false ">NO</v-btn>
                    <v-btn color="red" text @click=" resetPassword ">YES</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- dialog aktivasi -->
        <v-dialog v-model=" dialogAktivasi " persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark>Aktivasi Member</v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field v-model=" formMember.NAMA_MEMBER " label="Member Name" disabled></v-text-field>
                        <v-text-field v-model=" pembayaran " label="Pembayaran" required type="number"></v-text-field>

                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click=" dialogAktivasi = false; pembayaran = null ">Cancel</v-btn>
                    <v-btn color="blue" text @click=" dialogCekAktivasi = true ">Save</v-btn>
                </v-card-actions>
            </v-card>

            <v-dialog v-model=" dialogCekAktivasi " persistent max-width="600px" style="z-index: 1000;">
                <v-card>
                    <v-card-title class="text-h5 red lighten-2">
                        <v-toolbar color="red" dark>Are You Sure To Activate This Member?</v-toolbar>
                    </v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red" text @click=" dialogCekAktivasi = false ">NO</v-btn>
                        <v-btn color="red" text @click=" aktivasiProcess ">YES</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

        </v-dialog>
        <!-- dialog aktivasi -->

        <!-- dialog deposit uang -->
        <v-dialog v-model=" dialogTambahDepositUang " persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark>Add Deposit Member</v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field v-model=" formMember.NAMA_MEMBER " label="Member Name" disabled></v-text-field>
                        <v-text-field v-model=" jumlahBayar " label="Pembayaran" required type="number"></v-text-field>

                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text @click=" dialogTambahDepositUang = false; jumlahBayar = null ">Cancel</v-btn>
                    <v-btn color="blue" text @click=" dialogCekDepositUang = true ">Save</v-btn>
                </v-card-actions>
            </v-card>

            <v-dialog v-model=" dialogCekDepositUang " persistent max-width="600px" style="z-index: 1000;">
                <v-card>
                    <v-card-title class="text-h5 red lighten-2">
                        <v-toolbar color="red" dark>Are You Sure To add deposit This Member?</v-toolbar>
                    </v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red" text @click=" dialogCekDepositUang = false ">NO</v-btn>
                        <v-btn color="red" text @click=" addDepositUangProcess ">YES</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

        </v-dialog>
        <!-- dialog deposit uang -->

        <!-- dialog deposit Kelas -->
        <v-dialog v-model=" dialogTambahDepositKelas " persistent max-width="600px" style="z-index: 1000;">
            <v-card>
                <v-card-title class="text-h5 red lighten-2">
                    <v-toolbar color="red" dark>Add Deposit Member</v-toolbar>
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field v-model=" formMember.NAMA_MEMBER " label="Member Name" disabled></v-text-field>
                        <v-select v-model=" idKelas " label="Class Name" :items=" kelas " item-text="NAMA_KELAS"
                            item-value="ID_KELAS"></v-select>
                            <v-text-field v-model=" hargaKelas " label="Harga Kelas" required type="number"
                            disabled :value="harga"></v-text-field>
                        <v-text-field v-model=" jumlahBayar " label="Pembayaran" required type="number"
                            disabled :value="totalBayar"></v-text-field>
                        <v-text-field v-model=" jumlahKelas " label="Jumlah Kelas" required type="number"></v-text-field>

                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red" text
                        @click=" dialogTambahDepositKelas = false; jumlahBayar = null; idKelas = null; jumlahBayar = null; jumlahKelas = null; hargaKelas = null ">Cancel</v-btn>
                    <v-btn color="blue" text @click=" dialogCekDepositKelas= true ">Save</v-btn>
                </v-card-actions>
            </v-card>

            <v-dialog v-model=" dialogCekDepositKelas " persistent max-width="600px" style="z-index: 1000;">
                <v-card>
                    <v-card-title class="text-h5 red lighten-2">
                        <v-toolbar color="red" dark>Are You Sure To add deposit This Member?</v-toolbar>
                    </v-card-title>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red" text @click=" dialogCekDepositKelas = false ">NO</v-btn>
                        <v-btn color="red" text @click=" addDepositKelasProcess ">YES</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

        </v-dialog>
        <!-- dialog deposit kelas -->


    </v-main>
</template>

<script>
import store from '@/store/index';
import axios from 'axios';
import toastr from 'toastr';
import router from '@/router';
import { onMounted } from 'vue';
export default {
    data() {
        return {
            nama: store.state.dataUser.data.NAMA_PEGAWAI,
            headers: [
                { text: 'ID', value: 'ID_MEMBER' },
                { text: 'Nama', value: 'NAMA_MEMBER' },
                { text: 'Alamat', value: 'ALAMAT_MEMBER' },
                { text: 'No. Telp', value: 'TELEPON_MEMBER' },
                { text: 'Jumlah Deposit', value: 'JUMLAH_DEPOSIT_UANG' },
                { text: 'Email', value: 'EMAIL' },
                { text: 'Status', value: 'Status' },
                { text: 'Action', value: 'action' },
            ],
            dataMember: store.state.dataMember.data,
            search: '',
            dialog: false,
            formMember: {
                NAMA_MEMBER: '',
                ALAMAT_MEMBER: '',
                TELEPON_MEMBER: '',
                EMAIL: '',
                TANGGAL_LAHIR: '',
            },
            id: null,
            dialogDelete: false,
            dialogAddEdit: false,
            updateTitle: false,
            addTitle: false,
            updateButton: false,
            addShow: false,
            modal: false,
            dialogAddUpdate: false,
            addConfirmTitle: false,
            updateConfirmTitle: false,
            addBtn: false,
            updateBtn: false,
            dialogReset: false,
            dialogAktivasi: false,
            pembayaran: null,
            status: null,
            dialogCekAktivasi: false,
            dialogTambahDepositUang: false,
            dialogCekDepositUang: false,
            jumlahBayar: null,
            dialogTambahDepositKelas: false,
            dialogCekDepositKelas: false,
            jumlahKelas: null,
            idKelas: null,
            kelas: store.state.dataKelas.data,
            hargaKelas: null,
        }
    },
    async mounted() {
        setInterval(async () => {
            const up = await axios.get(store.state.domainName + 'member')
            const up2 = await axios.get(store.state.domainName + 'kelas')
            store.commit('setDataKelas', up2.data)
            store.commit('setDataMember', up.data)
        }, 10000);
    },
    methods: {
        dialogProcess(id) {
            this.dialog = true
            this.id = id
        },
        formProcess(item) {
            this.formMember.NAMA_MEMBER = item.NAMA_MEMBER
            this.formMember.ALAMAT_MEMBER = item.ALAMAT_MEMBER
            this.formMember.TELEPON_MEMBER = item.TELEPON_MEMBER
            this.formMember.EMAIL = item.EMAIL
            this.formMember.TANGGAL_LAHIR = item.TANGGAL_LAHIR
            this.status = item.STATUS
        },
        showMemberCard() {
            window.open(store.state.domainName + 'cetak-member-card/' + this.id)
        },
        resetPassword() {
            axios.post(store.state.domainName + 'resetPassword/' + this.id)
            toastr.success(this.formMember.NAMA_MEMBER + ' Password has been reset')
            this.dialogReset = false
        },
        async deleteProcces() {
            const up = await axios.delete(store.state.domainName + 'member/' + this.id)
                .then(async () => {
                    toastr.success(this.formMember.NAMA_MEMBER + ' has been deleted')
                    this.dialogDelete = false
                    const data = await axios.get(store.state.domainName + 'member')
                    store.commit('setDataMember', data.data)
                    router.go()
                }).catch(() => {
                    toastr.error('Failed to delete ' + this.formMember.NAMA_MEMBER)
                })
        },
        clearForm() {
            this.formMember.NAMA_MEMBER = ''
            this.formMember.ALAMAT_MEMBER = ''
            this.formMember.TELEPON_MEMBER = ''
            this.formMember.EMAIL = ''
            this.formMember.TANGGAL_LAHIR = ''
        },
        addFuntion() {
            this.clearForm()
            this.dialogAddEdit = true
            this.addTitle = true
            this.addShow = true
            this.updateButton = false
            this.updateTitle = false
        },
        cancelAddEdit() {
            this.dialogAddEdit = false
            this.addTitle = false
            this.addShow = false
            this.updateButton = false
            this.updateTitle = false
        },
        async addProcess() {
            if (this.formMember.NAMA_MEMBER == '' || this.formMember.ALAMAT_MEMBER == '' || this.formMember.TELEPON_MEMBER == '' || this.formMember.EMAIL == '' || this.formMember.TANGGAL_LAHIR == '') {
                toastr.error('Please fill all the form')
            }
            else if (this.formMember.TELEPON_MEMBER.length < 11 || this.formMember.TELEPON_MEMBER.length > 13) {
                toastr.error('Phone number must between 11 and 13 character')
            }
            else if (this.formMember.EMAIL.includes('@') == false) {
                toastr.error('Email must be valid')
            }
            else {
                const upData = {
                    nama_member: this.formMember.NAMA_MEMBER,
                    alamat_member: this.formMember.ALAMAT_MEMBER,
                    telepon_member: this.formMember.TELEPON_MEMBER,
                    email: this.formMember.EMAIL,
                    tanggal_lahir: this.formMember.TANGGAL_LAHIR,
                }
                const up = await axios.post(store.state.domainName + 'member', upData)
                    .then(async () => {
                        toastr.success(this.formMember.NAMA_MEMBER + ' has been added')
                        const data = await axios.get(store.state.domainName + 'member')
                        this.dialogAddEdit = false
                        this.addTitle = false
                        this.addShow = false
                        this.updateButton = false
                        this.updateTitle = false
                        store.commit('setDataMember', data.data)
                        router.go()
                    }).catch((err) => {
                        toastr.error('Failed to add ' + this.formMember.NAMA_MEMBER)
                        console.log(err)
                    })
            }
        },
        updateFuntion() {
            this.dialogAddEdit = true
            this.addTitle = false
            this.addShow = false
            this.updateButton = true
            this.updateTitle = true
        },
        async updateProcess() {
            if (this.formMember.NAMA_MEMBER == '' || this.formMember.ALAMAT_MEMBER == '' || this.formMember.TELEPON_MEMBER == '' || this.formMember.EMAIL == '' || this.formMember.TANGGAL_LAHIR == '') {
                toastr.error('Please fill all the form')
            }
            else if (this.formMember.TELEPON_MEMBER.length < 11 || this.formMember.TELEPON_MEMBER.length > 13) {
                toastr.error('Phone number must between 11 and 13 character')
            }
            else if (this.formMember.EMAIL.includes('@') == false) {
                toastr.error('Email must be valid')
            }
            else {
                const upData = {
                    nama_member: this.formMember.NAMA_MEMBER,
                    alamat_member: this.formMember.ALAMAT_MEMBER,
                    telepon_member: this.formMember.TELEPON_MEMBER,
                    email: this.formMember.EMAIL,
                    tanggal_lahir: this.formMember.TANGGAL_LAHIR,
                }
                const up = await axios.put(store.state.domainName + 'member/' + this.id, upData)
                    .then(async () => {
                        toastr.success(this.formMember.NAMA_MEMBER + ' has been updated')
                        const data = await axios.get(store.state.domainName + 'member')
                        this.dialogAddEdit = false
                        this.addTitle = false
                        this.addShow = false
                        this.updateButton = false
                        this.updateTitle = false
                        store.commit('setDataMember', data.data)
                        router.go()
                    }).catch((err) => {
                        toastr.error('Failed to update ' + this.formMember.NAMA_MEMBER)
                        console.log(err)
                    })
            }
        },
        addShows() {
            this.dialogAddUpdate = true
            this.addConfirmTitle = true
            this.addBtn = true
            this.updateBtn = false
            this.updateConfirmTitle = false
        },
        updateShows() {
            this.dialogAddUpdate = true
            this.addConfirmTitle = false
            this.addBtn = false
            this.updateBtn = true
            this.updateConfirmTitle = true
        },
        async aktivasiProcess() {
            if (this.pembayaran != 3000000) {
                toastr.error('Pembayaran must be Rp. 3.000.000')
            }
            else {
                const upData = {
                    id_member: this.id,
                    id_pegawai: store.state.dataUser.data.ID_PEGAWAI,
                    jumlah_pembayaran_transaksi_aktivasi: this.pembayaran,
                }
                const up = await axios.post(store.state.domainName + 'transaksi-aktivasi', upData)
                    .then(async (response) => {
                        const data = await axios.get(store.state.domainName + 'member')
                        this.dialogAddUpdate = false
                        this.addConfirmTitle = false
                        this.addBtn = false
                        this.updateBtn = false
                        this.updateConfirmTitle = false
                        store.commit('setDataMember', data.data)
                        toastr.success('Member has been activated', setTimeout(() => {
                            router.go()
                        }, 1000))
                        window.open(store.state.domainName + 'cetak-struk-aktivasi/' + response.data.data)
                    }).catch((err) => {
                        toastr.error('Failed to activate member')
                        console.log(err)
                    })
            }
        },
        async addDepositUangProcess() {
            if (this.jumlahBayar == null) {
                toastr.error('Please fill the form')
            }
            else if (this.jumlahBayar < 500000) {
                toastr.error('Minimum 500K deposit')
            } else {
                const upData = {
                    id_member: this.id,
                    id_pegawai: store.state.dataUser.data.ID_PEGAWAI,
                    jumlah_transaksi_deposit_uang: this.jumlahBayar,
                }
                const up = await axios.post(store.state.domainName + 'transaksi-deposit-uang', upData)
                    .then(async (response) => {
                        const data = await axios.get(store.state.domainName + 'member')
                        this.dialogAddUpdate = false
                        this.addConfirmTitle = false
                        this.addBtn = false
                        this.updateBtn = false
                        this.updateConfirmTitle = false
                        store.commit('setDataMember', data.data)
                        toastr.success('Deposit has been added', setTimeout(() => {
                            router.go()
                        }, 1000))
                        window.open(store.state.domainName + 'cetak-struk-deposit-uang/' + response.data.data)
                    }).catch((err) => {
                        toastr.error('Failed to add deposit')
                        console.log(err)
                    })
            }
        },
        async addDepositKelasProcess(){
            if(this.idKelas == null && this.jumlahKelas == null)
            {
                toastr.error('Please fill the form')
            }
            else if(this.jumlahKelas < 1)
            {
                toastr.error('Minimum 1 class')
            }
            else
            {
                const upData = {
                    id_member: this.id,
                    id_kelas: this.idKelas,
                    id_pegawai: store.state.dataUser.data.ID_PEGAWAI,
                    jumlah_kelas: this.jumlahKelas,
                }
                const up = await axios.post(store.state.domainName + 'transaksi-deposit-kelas', upData)
                    .then(async (response) => {
                        const data = await axios.get(store.state.domainName + 'member')
                        this.dialogAddUpdate = false
                        this.addConfirmTitle = false
                        this.addBtn = false
                        this.updateBtn = false
                        this.updateConfirmTitle = false
                        store.commit('setDataMember', data.data)
                        toastr.success('Deposit has been added', setTimeout(() => {
                            router.go()
                        }, 1000))
                        window.open(store.state.domainName + 'cetak-struk-deposit-kelas/' + response.data.data)
                    }).catch((err) => {
                        toastr.error('Failed to add deposit')
                        console.log(err)
                    })
            }
        }
    },
    setup() {
        onMounted(async () => {
            const datamember = await axios.get(store.state.domainName + 'member');
            const dataKelas = await axios.get(store.state.domainName + 'kelas');
            store.commit('setDataMember', datamember.data);
            store.commit('setDataKelas', dataKelas.data);
        });
    },
    computed: {
        totalBayar() {
            if (this.idKelas) {
                const kelas = this.kelas.find(k => k.ID_KELAS === this.idKelas);
                this.jumlahBayar = kelas.HARGA_KELAS * this.jumlahKelas;
                return kelas.HARGA_KELAS * this.jumlahKelas;
            } else {
                return null;
            }
        },
        harga(){
            if(this.idKelas)
            {
                const kelas = this.kelas.find(k => k.ID_KELAS === this.idKelas);
                this.hargaKelas = kelas.HARGA_KELAS;
                return kelas.HARGA_KELAS;
            }
            else
            {
                return null;
            }
        }
    }

}
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
</style>
