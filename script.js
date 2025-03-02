// Ngambil elemen form
const formulir = document.querySelector("form");

// Bikin trigger event submit pada elemen form
formulir.addEventListener("submit", (e) => {
  e.preventDefault();

  // Ngambil elemen input
  const elemen_Title = document.querySelector("#Title");
  const elemen_Content = document.querySelector("#Content");

  // Ngambil value dari elemen input
  const Title = elemen_Title.value;
  const Content = elemen_Content.value;

  const id = elemen_Title.dataset.id; // <- Khusus edit

  // Ngecek apakah harus POST atau PUT
  // Kalo id kosong, jadinya POST
  if (id == "") {
    // Tambah notes
    axios
      .post("http://localhost:5000/add-notes", { Title, Content })
      .then(() => {
        // bersihin formnya
        elemen_Title.value = "";
        elemen_Content.value = "";

        // manggil fungsi get  biar datanya di-refresh
        getNotes();
      })
      .catch((error) => console.log(error.message)); // <- Kalo ada error
  } else {
    axios
      .put(`http://localhost:5000/edit-notes/${id}`, { Title, Content })
      .then(() => {
        // bersihin formnya
        elemen_Title.dataset.id = "";
        elemen_Title.value = "";
        elemen_Content.value = "";

        // manggil fungsi get  biar datanya direfresh
        getNotes();
      })
      .catch((error) => console.log(error)); // <- Kalo ada error
  }
});

// GET 
async function getNotes() {
  try {
    const { data } = await axios.get("http://localhost:5000/notes");

    const table = document.querySelector("#table-notes");
    let tampilan = "";
    let no = 1;

    for (const notes of await data) {
      tampilan += tampilkanNotes(no, notes);
      no++;
    }
    table.innerHTML = tampilan;
    hapusNotes();
    editNotes();
  } catch (error) {
    console.log(error.message);
  }
}

function tampilkanNotes(no, notes) {
  return `
    <tr>
      <td>${no}</td>
      <td class="Title">${notes.Title}</td>
      <td class="Content">${notes.Content}</td>
      <td><button data-id=${notes.id} class='btn-edit'>Edit</button></td>
      <td><button data-id=${notes.id} class='btn-hapus'>Hapus</button></td>
    </tr>
  `;
}

function hapusNotes() {
  const kumpulan_tombol_hapus = document.querySelectorAll(".btn-hapus");

  kumpulan_tombol_hapus.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      axios
        .delete(`http://localhost:5000/delete-notes/${id}`)
        .then(() => getNotes())
        .catch((error) => console.log(error));
    });
  });
}

function editNotes() {
  const kumpulan_tombol_edit = document.querySelectorAll(".btn-edit");

  kumpulan_tombol_edit.forEach((tombol_edit) => {
    tombol_edit.addEventListener("click", () => {
      // Ngambil value yg ada di form
      const id = tombol_edit.dataset.id;
      const Title =
        tombol_edit.parentElement.parentElement.querySelector(
          ".Title"
        ).innerText;
      const Content =
        tombol_edit.parentElement.parentElement.querySelector(
          ".Content"
        ).innerText;

      // Ngambil [elemen] input
      const elemen_Title = document.querySelector("#Title");
      const elemen_Content = document.querySelector("#Content");

      // Masukkin value yang ada di baris yang dipilih ke form
      elemen_Title.dataset.id = id;
      elemen_Title.value = Title;
      elemen_Content.value = Content;
    });
  });
}

getNotes();