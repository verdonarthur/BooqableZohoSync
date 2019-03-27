<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" fixed clipped app>
      <v-list>
        <v-list-tile :to="{ name: 'home'}">
          <v-list-tile-action>
            <v-icon color="blue">star</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Dashboard</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile :to="{ name: 'customers'}">
          <v-list-tile-action>
            <v-icon color="blue">star</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Customers</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile :to="{ name: 'products'}">
          <v-list-tile-action>
            <v-icon color="blue">star</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Products</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile :to="{ name: 'invoices'}">
          <v-list-tile-action>
            <v-icon color="blue">star</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Invoices</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="blue" dense fixed clipped-left app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title class="mr-5 align-center">
        <span class="title">ZOHOBOOQ</span>
      </v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fill-height>
        <v-layout justify-center align-center>
          <v-flex shrink>
            <router-view></router-view>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  components: {},
  data() {
    return {
      drawer:null
    };
  }
};
</script>
