<template>
    <v-main class="gym-bg">
      <v-container class="py-10">
        <v-row >
          <v-col cols="12">
            <h1 class="display-3 text-center text-white">Class Schedule</h1>
          </v-col>
        </v-row>
        <v-row >
          <v-col cols="12" md="6" lg="4" v-for="(schedule, index) in schedules" :key="index">
            <v-card class="mb-5">
              <v-card-title class="mt-3">
                <h2 class="headline font-weight-bold mb-0">{{ schedule.name }}</h2>
                <p class="subtitle-1">{{ schedule.startTime }} - {{ schedule.endTime }}</p>
              </v-card-title>
              <v-card-text>
                <p class="mb-0">Instructor: {{ schedule.instructor }}</p>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" text @click="editSchedule(schedule)">
                  Edit
                </v-btn>
                <v-btn color="error" text @click="deleteSchedule(schedule)">
                  Delete
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </template>
  <script>
  export default {
    data() {
      return {
        schedules: [
          {
            name: 'Pilates',
            startTime: '08:00',
            endTime: '09:00',
            instructor: 'Jane Doe'
          },
          {
            name: 'Zumba',
            startTime: '10:00',
            endTime: '11:00',
            instructor: 'John Doe'
          },
          {
            name: 'Yoga',
            startTime: '12:00',
            endTime: '13:00',
            instructor: 'Jackie Chan'
          },
          {
            name: 'Crossfit',
            startTime: '14:00',
            endTime: '15:00',
            instructor: 'Arnold Schwarzenegger'
          },
          {
            name: 'Body Pump',
            startTime: '16:00',
            endTime: '17:00',
            instructor: 'Mila Kunis'
          }
        ],
      }
    },
    methods: {
      editSchedule(schedule) {
        // implementasi fungsi edit jadwal kelas
      },
      deleteSchedule(schedule) {
        // implementasi fungsi hapus jadwal kelas
      }
    }
  }
  </script>
  <style scoped>
  .gym-bg {
    background-color: #f2f2f2;
    width: 100%;
  }

  .v-card__text p {
    margin-bottom: 0;
  }

  .v-card__subtitle {
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .v-card__title {
    margin-top: 20px;
    margin-bottom: 0;
  }

  .v-card__actions {
    display: flex;
    justify-content: space-between;
  }
  </style>
