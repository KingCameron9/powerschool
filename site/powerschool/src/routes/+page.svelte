
<script lang='ts'>
	import { onMount } from "svelte";


  let data = {teachers: []};
  
  async function getStudentData() {
    const req = await fetch(
    "http://127.0.0.1:5001/powerschool-37afb/us-central1/getStudentData",
    {
      method: "POST",
      body: JSON.stringify({
        url: "https://fccps.powerschool.com",
        username: "cd25037",
        password: "Bella32",
      }),
    });

    return await req.json();
  }

  onMount(async () => {
    data = await getStudentData();
  });

</script>
<!-- <p>{JSON.stringify(data)}</p> -->

{#each data.teachers as teacher}
  <p>{teacher.firstName + " " + teacher.lastName}</p>
{/each}
