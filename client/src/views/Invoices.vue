<template>
  <div>
    <h1>Invoices</h1>
    <v-data-table :headers="headers" :items="products" class="elevation-1">
      <template v-slot:items="props">
        <td>{{ props.item.reference }}</td>
        <td class="text-xs-right">{{ props.item.startDate }}</td>
        <td class="text-xs-right">{{ props.item.stopDate }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import Invoices from "../class/Invoice";

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
      products: []
    };
  }
};
</script>
