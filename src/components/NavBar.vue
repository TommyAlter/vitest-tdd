<template>
  <nav class="navbar navbar-expand bg-body-tertiary shadow-sm">
    <div class="container">
      <router-link class="navbar-brand" data-testid="link-home-page" to="/">
        <img src="@/assets/hoaxify.png" alt="logo" width="60" />Hoaxify
      </router-link>
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link class="nav-link" data-testid="link-signup-page" to="/signup">{{
            $t('signUp')
          }}</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
