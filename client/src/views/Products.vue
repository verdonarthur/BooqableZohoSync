<template>
  <div>
    <h1>Customers</h1>
    <v-data-table :headers="headers" :items="products" class="elevation-1">
      <template v-slot:items="props">
        <td>{{ props.item.name }}</td>
        <td class="text-xs-right">{{ props.item.priceInCents }}</td>
        <td class="text-xs-right">{{ props.item.sku }}</td>
        <td class="text-xs-right">{{ props.item.zohoID }}</td>
        <td class="text-xs-right">{{ props.item.booqableID }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import Product from "../class/Product";

export default {
  components: {},
    async created() {
    try {
      let data = await Product.getAll()
      this.products = data
    } catch (err) {
      console.log(err)
    }
  },
  data:()=>{
    return {
      headers: [
        {
          text: 'Display name',
          align: 'left',
          value: 'name'
        },
        { text: 'priceInCents', value: 'priceInCents' },
        { text: 'sku', value: 'sku' },
        { text: 'Zoho ID', value: 'zohoID' },
        { text: 'Booqable ID', value: 'booqableID' },
      ],
      products:[]
    }
  }
};
</script>
