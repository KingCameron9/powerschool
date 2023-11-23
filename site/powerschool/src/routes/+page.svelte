
<script lang='ts'>
	import { onMount } from "svelte";


  let data = {teachers: [], finalGrades: [], sections: []};

  let sections: PowerSchoolClass[] = [];

  
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
    data.sections.forEach((section: any) => {
      let thisSection: PowerSchoolClass = {
        className: "", 
        teacherName: "" 
      }

      thisSection.teacherName = section.schoolCourseTitle;

      sections.push(thisSection);
    })
    console.log('data', sections);
  });

  type PowerSchoolClass = {
    className: string,
    teacherName: string
  };

</script>

<p>hello</p>
{#each sections as section}
  <p>{section.teacherName} hello</p>
{/each}
