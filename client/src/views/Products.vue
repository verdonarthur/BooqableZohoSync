<template>
  <v-container fluid grid-list-xl>
    <h1>Products</h1>
    <div md12>
      <v-btn
        :loading="isSyncing"
        :disabled="isSyncing"
        color="blue"
        medium
        outline
        @click="syncProducts()"
      >
        Complete sync
        <v-icon right dark>sync</v-icon>
      </v-btn>
    </div>
    <div md12>
      <v-data-table :headers="headers" :items="products">
        <template v-slot:items="props">
          <td>{{ props.item.name }}</td>
          <td class="text-xs-right">{{ props.item.priceInCents }}</td>
          <td class="text-xs-right">{{ props.item.sku }}</td>
          <td class="text-xs-right">{{ props.item.zohoID }}</td>
          <td class="text-xs-right">{{ props.item.booqableID }}</td>
        </template>
      </v-data-table>
    </div>
  </v-container>
</template>

<script>
import Product from "../class/Product";

export default {
  components: {},
  async created() {
    try {
      this.products = await Product.getAll();
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    async syncProducts() {
      this.isSyncing = true;

      try {
        await Product.sync();
        this.products = await Product.getAll();
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
