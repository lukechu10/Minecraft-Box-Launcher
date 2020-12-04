<script lang="ts">
    let klass = "";
    export { klass as class };
</script>

<style>
    button:hover {
        transform: translateY(-2px);
    }

    button:active {
        transform: translateY(-1px);
    }
</style>

<button
    on:click
    class="rounded-md hover:shadow-md float-right font-semibold h-9 px-4 transition-all {klass || 'text-white bg-blue-700 hover:bg-blue-500'}"
>
    <slot />
</button>
