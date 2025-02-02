const studentForm = $('#studentForm');
		let students = [];

		function appendStudentToDOM(student){
			students.push(student)
			$('#studentsList').append(`
				<div class="student">
					<div class="student-table-wrapper">
			<table class="table student-table">
				<thead>
				  <tr>
					<th scope="col">No. ${student.id}</th>
					<th scope="col">FULL NAME : ${student.fullName}</th>
					<th scope="col">PHONE NUMBER : ${student.phoneNumber}</th>
					<th scope="col">WEEKLY KPI : ${student.wkpi}</th>
					<th scope="col">MONTHLY KPI : ${student.mkpi}</th>
					<img onclick="showUpdateModalForm(this)" src="./icons/pencil.png" id="edit_student" alt="edit" data-id="${student.id}">
					<img onclick="handleDelete(this)" data-id="${student.id}" src="./icons/cancel.png" id="delete_student" alt="cancel">
					</tr>
					</thead>
					</table>
					</div>
				</div>
			`)
		}

		async function showUpdateModalForm(elem) {
			const id = $(elem).data('id');
			const student = students.find(student => student.id === id);
			console.log(student);

			const { value: formValues } = await Swal.fire({
				title: 'Update Form',
				html:
					`<input value="${student.fullName}" id="fullName${id}" class="swal2-input">` +
					`<input value="${student.phoneNumber}" id="phoneNumber${id}" class="swal2-input">` +
					`<input value="${student.wkpi}" id="wkpi${id}" class="swal2-input">` +
					`<input value="${student.mkpi}" id="mkpi${id}" class="swal2-input">`,
				focusConfirm: false,
				preConfirm: () => {
					return {
						fullName: document.getElementById(`fullName${id}`).value,
						phoneNumber: document.getElementById(`phoneNumber${id}`).value,
						wkpi: document.getElementById(`wkpi${id}`).value,
						mkpi: document.getElementById(`mkpi${id}`).value
					}
				}
			})

			if(formValues){
				fetch(`http://localhost:3000/students/${id}`, {
					method: 'PUT',
					headers: {
						'Content-type': 'application/json'
					},
					body: JSON.stringify(formValues)
				}).then(() => {
					$('#studentsList').empty();
					students = students.map(student => student.id === id ? ({
						...formValues,
						id
					}) : student)
					getContacts()
				})
			}
		}

		function handleDelete(elem) {
			const id = $(elem).data('id');

			Swal.fire({
				title: 'Are you sure?',
				text: "You won't be able to revert this!",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes, delete it!'
			}).then((result) => {
				if (result.isConfirmed) {
					fetch(`http://localhost:3000/students/${id}`, {
						method: 'DELETE'
					}).then(() => {
						$(`#studentsList div img[data-id=${id}]`).parent().remove();

						Swal.fire(
							'Deleted!',
							'Your file has been deleted.',
							'success'
						)
					})
				}
			})
		}

		function getStudents() {
			fetch('http://localhost:3000/students')
			.then(response => {
				return response.json()
			}).then(students => {
				students.forEach(student => appendContactToDOM(student))
			})
		}

		$(document).ready(() => {
			getStudents()
		})

		function createStudent({ fullName, phoneNumber, wkpi, mkpi }) {
			fetch('http://localhost:3000/students', {
				method: "POST",
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify({
					fullName,
					phoneNumber,
					wkpi,
					mkpi
				})
			}).then(response => {
				return response.json()
			}).then(student => appendStudentToDOM(student))
		}

		function handleFormSubmit(e) {
			e.preventDefault();
			const inputs = $('#studentForm input');
			let isValidForm = true;

			const formState = {
				fullName: {
					value: "",
					isRequired: true
				},
				phoneNumber: {
					value: "",
					isRequired: false
				},
				wkpi: {
					value: "",
					isRequired: true
				},
				mkpi: {
					value: "",
					isRequired: true
				}
			}

			for (let i = 0; i < inputs.length; i++) {
				const stateInput = formState[inputs[i].name];
				const currInput = inputs[i];

				if (stateInput.isRequired && !currInput.value) {
					alert('Заполни поля!')
					isValidForm = false;
					break
				}
				stateInput.value = currInput.value;
			}

			if (isValidForm) {
				const values = {
					fullName: formState.fullName.value,
					phoneNumber: formState.phoneNumber.value,
					wkpi: formState.wkpi.value,
					mkpi: formState.mkpi.value
				}
				createStudent(values);
				$('#studentForm').find('input').val("");
			}

		}

		studentForm.on('submit', handleFormSubmit);