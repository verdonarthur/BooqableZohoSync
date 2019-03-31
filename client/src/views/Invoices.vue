<template>
  <v-container fluid grid-list-xl>
    <h1>Invoices</h1>
    <div md12>
      <v-btn
        :loading="isSyncing"
        :disabled="isSyncing"
        color="blue"
        medium
        outline
        @click="createInvoiceFromBooqable()"
      >
        Create Invoice From Booqable
        <v-icon right dark>sync</v-icon>
      </v-btn>
    </div>
    <div>
      <v-data-table :headers="headers" :items="invoices" class="elevation-1">
        <template v-slot:items="props">
          <td>{{ props.item.reference }}</td>
          <td class="text-xs-right">{{ props.item.startDate }}</td>
          <td class="text-xs-right">{{ props.item.stopDate }}</td>
        </template>
      </v-data-table>
    </div>
  </v-container>
</template>

<script>
import Invoice from "../class/Invoice";

export default {
  components: {},
  async created() {
    try {
      let data = await Invoice.getAll();
      this.invoices = data;
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    async createInvoiceFromBooqable() {
      this.isSyncing = true;

      try {
        await Invoice.exportToZoho();
        this.invoices = await Invoice.getAll();
        this.isSyncing = false;
      } catch (err) {
        console.log(err);
        this.isSyncing = false;
      }
    }
  },
  data: () => {
    return {
      headers: [
        {
          text: "Display name",
          align: "left",
          value: "reference"
        },
        { text: "startDate", value: "startDate" },
        { text: "stopDate", value: "stopDate" }
      ],
      invoices: [],

      isSyncing: false
    };
  }
};
</script>
