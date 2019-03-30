<template>
  <div>
    <h1>Products</h1>
    <v-layout row justify-space-between>
      <v-flex md11 s12>
        <v-data-table :headers="headers" :items="products" class="elevation-1">
          <template v-slot:items="props">
            <td>{{ props.item.name }}</td>
            <td class="text-xs-right">{{ props.item.priceInCents }}</td>
            <td class="text-xs-right">{{ props.item.sku }}</td>
            <td class="text-xs-right">{{ props.item.zohoID }}</td>
            <td class="text-xs-right">{{ props.item.booqableID }}</td>
          </template>
        </v-data-table>
      </v-flex>
      <v-flex>
        <h2>Manual Sync</h2>
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
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Product from "../class/Product";

export default {
  components: {},
  async created() {
    try {
      let data = await Product.getAll();
      this.products = data;
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    syncProducts() {
      this.isSyncing = true;
      Product.sync().then(data => {
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
          value: "name"
        },
        { text: "priceInCents", value: "priceInCents" },
        { text: "sku", value: "sku" },
        { text: "Zoho ID", value: "zohoID" },
        { text: "Booqable ID", value: "booqableID" }
      ],
      products: [],
      isSyncing: false
    };
  }
};
</script>
