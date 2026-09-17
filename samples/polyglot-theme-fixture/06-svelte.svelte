<script lang="ts">
  let completed = false;
  $: label = completed ? "Done" : "Open";
</script>

<button class:active={completed} on:click={() => (completed = !completed)}>
  {label}
</button>
