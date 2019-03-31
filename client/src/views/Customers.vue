<template>
  <v-container fluid grid-list-xl>
    <h1>Customers</h1>      
      <div md12>
        <v-btn
          :loading="isSyncing"
          :disabled="isSyncing"
          color="blue"
          medium
          outline
          @click="syncCustomer()"
        >
          Complete sync
          <v-icon right dark>sync</v-icon>
        </v-btn>
        <v-btn
          :loading="isSyncingZoho"
          :disabled="isSyncingZoho"
          color="blue"          
          medium outline @click="syncCustomerZoho()" >Sync From Zoho<v-icon right dark>sync</v-icon>
        </v-btn>
        <v-btn
          :loading="isSyncingBooqable"
          :disabled="isSyncingBooqable"
          color="blue"          
          medium outline @click="syncCustomerBooqable()" >Sync From Booqable<v-icon right dark>sync</v-icon>
        </v-btn>
      </div>
      <div>
        <v-data-table :headers="headers" :items="customers">
          <template v-slot:items="props">
            <td>{{ props.item.displayName }}</td>
            <td class="text-xs-right">{{ props.item.email }}</td>
            <td class="text-xs-right">{{ props.item.zohoID }}</td>
            <td class="text-xs-right">{{ props.item.booqableID }}</td>
          </template>
        </v-data-table>
      </div>
  </v-container>
</template>

<script>
import Customer from "../class/Customer";

export default {
  components: {},  
  async created() {
    try {
      this.customers = await Customer.getAll();
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    async syncCustomer() {
      this.isSyncing = true;
      try {
        await Customer.sync();
        this.customers = await Customer.getAll();
        this.isSyncing = false;
      } catch (e) {
        this.isSyncing = false;
        console.log(e);
      }
    },
    async syncCustomerZoho() {
      this.isSyncingZoho = true;
      try {
        await Customer.syncFrom("zoho");
        this.customers = await Customer.getAll();
        this.isSyncingZoho = false;
      } catch (e) {
        this.isSyncingZoho = false;
        console.log(e);
      }
    },
    async syncCustomerBooqable() {
      this.isSyncingBooqable = true;
      try {
        await Customer.syncFrom("booqable");
        this.customers = await Customer.getAll();
        this.isSyncingBooqable = false;
      } catch (e) {
        this.isSyncingBooqable = false;
        console.log(e);
      }
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
      isSyncing: false,
      isSyncingBooqable:false,
      isSyncingZoho:false
    };
  }
};
</script>
