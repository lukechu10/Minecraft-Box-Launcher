<script lang="ts">
    let klass = "";
    export { klass as class };

    export let height = "";
</script>

<style>
    button:hover {
        transform: translateY(-2px);
        @apply hover:shadow-md;
    }
</style>

<button
    on:click
    class="rounded-md float-right font-semibold px-4 transition-all {height || 'h-9'} {klass || 'text-white bg-blue-700 hover:bg-blue-500'}"
>
    <slot />
</button>
