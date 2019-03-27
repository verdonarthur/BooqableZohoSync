<template>
  <div>
    <h1>Logs</h1>
    <v-data-table :headers="headers" :items="logs" class="elevation-1">
      <template v-slot:items="props">
        <td>{{ props.item.level }}</td>
        <td>{{ props.item.message }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import Log from "../class/Log";

export default {
  components: {},
    async created() {
    try {
      let data = await Log.getAll()
      this.logs = data
    } catch (err) {
      console.log(err)
    }
  },
  data:()=>{
    return {
      headers: [
        {
          text: 'Level',
          align: 'left',
          value: 'level'
        },
        { text: 'Message', value: 'message' },
      ],
      logs:[]
    }
  }
};
</script>
