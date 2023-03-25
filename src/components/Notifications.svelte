<script lang="ts">
  import { notifications } from "src/utils/notificationStore";
  import NotificationPopup from "./NotificationPopup.svelte";

</script>

<div class="absolute top-5 right-8 flex flex-col gap-5">
 {#each $notifications as notification}
   <NotificationPopup message={notification}/> 
 {/each}
</div>
