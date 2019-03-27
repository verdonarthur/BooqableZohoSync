<template>
  <v-container fluid grid-list-xl>
    <h1>Customers</h1>
    <v-layout row justify-space-between>
      <v-flex md11 s12>
        <v-data-table :headers="headers" :items="customers" class="elevation-1">
          <template v-slot:items="props">
            <td>{{ props.item.displayName }}</td>
            <td class="text-xs-right">{{ props.item.email }}</td>
            <td class="text-xs-right">{{ props.item.zohoID }}</td>
            <td class="text-xs-right">{{ props.item.booqableID }}</td>
          </template>
        </v-data-table>
      </v-flex>
      <v-flex>
        <v-btn
          :loading="isSyncing"
          :disabled="isSyncing"
          color="blue"
          medium
          block
          outline
          @click="syncCustomer()"
        >
          Sync
          <v-icon right dark>sync</v-icon>
        </v-btn>
        <v-btn
          :loading="isSyncing"
          :disabled="isSyncing"
          color="blue"
          medium
          block
          outline
          @click="syncCustomer()"
        >
          -> Zoho
          <v-icon right dark>sync</v-icon>
        </v-btn>
        <v-btn
          :loading="isSyncing"
          :disabled="isSyncing"
          color="blue"
          medium
          block
          outline
          @click="syncCustomer()"
        >
          -> Booqable
          <v-icon right dark>sync</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Customer from "../class/Customer";

export default {
  components: {},
  async created() {
    try {
      let data = await Customer.getAll();
      this.customers = data;
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    syncCustomer() {
      this.isSyncing = true;
      Customer.sync().then(data => {
        this.isSyncing = false;
      });
    }
  },
  data: () => {
    return {
      headers: [
        {
          text: "Display name",
          align: "left",
          value: "displayName"
        },
        { text: "Email", value: "email" },
        { text: "Zoho ID", value: "zohoID" },
        { text: "Booqable ID", value: "booqableID" }
      ],
      customers: [],
      isSyncing: false
    };
  }
};
</script>
