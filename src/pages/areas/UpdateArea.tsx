import Sidebar from "../../components/Sidebar";
import Select from "../../components/Select";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../../components/Alert";
import styles from "../../styles/pages/Tickets.module.css";
import { Area, Sede, TypeSpace, Building, Floor, Division } from "../../types/Area";
import { useAreas } from "../../hooks/useAreas";

const UpdateArea: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getAreaById, updatedArea } = useAreas();
    const [errorMessage, setErrorMessage] = useState<String | null>(null);
    const [successMessage, setSuccessMessage] = useState<String | null>(null);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [area, setArea] = useState<Area | null>(null);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState<Omit<Area, "id_area" | "status">>({
        type_space: TypeSpace.Administrativo,
        sede: Sede.Centro,
        building: Building.Edificio1,
        floor: Floor.PB,
        division: Division.D1,
        coordination: "",
        classroom_lab: true,
        image: [],
        equipment: [],
        classroom: "",
    });

    useEffect(() => {
        const fetchArea = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const areaData = await getAreaById(parseInt(id));
                if (!areaData) {
                    setErrorMessage("El área no fue encontrada.");
                    setTimeout(() => navigate("/auth/area"), 1500);
                    return;
                }
                setArea(areaData);
            } catch (error) {
                console.log("Error al obtener el area:", error);
                setErrorMessage(`Error al obtener el area: ${error}`);
                setTimeout(() => navigate("/auth/area"), 1500);
            } finally {
                setLoading(false);
            }
        };

        fetchArea();
    }, [id]);

    useEffect(() => {
        if (area) {
            if (area && area.image) {
                setPreviewImages(
                    area.image.map(img =>
                        typeof img === "string" ? img : URL.createObjectURL(img)
                    )
                );

            }

            setFormData({
                type_space: area.type_space,
                sede: area.sede,
                building: area.building,
                floor: area.floor,
                division: area.division,
                coordination: area.coordination,
                classroom_lab: area.classroom_lab,
                image: area.image,
                equipment: area.equipment,
                classroom: area.classroom
            });
        }
    }, [area])

    const handleSubmit = async () => {
        if (!id) {
            setErrorMessage("El ID no es valido.");
            return;
        }

        const hasEmptyFields = Object.entries(formData).some(([value]) => {
            if ((value === null || value === "")) {
                return false;
            }
            return value === "";
        });
        if (hasEmptyFields) {
            setErrorMessage("Debe llenar todos los campos.");
            setTimeout(() => setErrorMessage(null), 3000);
            return;
        }

        try {
            console.log("Datos antes de ser guardados:", formData);
            await updatedArea(parseInt(id), formData);
            setSuccessMessage("Area actualizada correctamente.")
            setTimeout(() => navigate("/auth/area"), 2000);
        } catch (error) {
            setErrorMessage("Error al actualizar el area.");
            setTimeout(() => setErrorMessage(null), 3000);
        }
    }

    const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => {
            if (checked) {
                return { ...prev, equipment: [...prev.equipment, name] };
            } else {
                return { ...prev, equipment: prev.equipment.filter(item => item !== name) };
            }
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);

        setPreviewImages(prev => {
            const updatedPreviews = [...prev];
            updatedPreviews[index] = previewUrl;
            return updatedPreviews;
        });

        setFormData(prev => {
            const updatedImages = [...prev.image];
            updatedImages[index] = file;
            return { ...prev, image: updatedImages };
        });
    };

    const typeSpaceOptions = Object.values(TypeSpace);
    const sedeOptions = Object.values(Sede);
    const buildingOptions = Object.values(Building);
    const floorOptions = Object.values(Floor);
    const divisionOptions = Object.values(Division);

    if (loading) return <Loading />;

    return (
        <div className={styles.body}>
            <div className={styles[`cont`]}>
                <Sidebar />
                <div className="container" style={{ marginTop: "50px" }}>
                    {successMessage && <Alert text={String(successMessage)} iconVariant="success" variant="alert alert-success" />}
                    {errorMessage && <Alert text={String(errorMessage)} iconVariant="error" variant="alert alert-danger" />}
                    <h1>Editar area</h1>
                    <hr style={{ border: "1px solid" }} />
                    <div className="row g-3">
                        <div className="col">
                            <div className="mb-3">
                                <label form="exampleFormControlInput1" className="form-label"><strong>Tipo de espacio</strong></label>
                                <Select
                                    data={typeSpaceOptions.map((item) => ({ value: item, label: item }))}
                                    option={{ key: "value", label: "label" }}
                                    value={formData.type_space}
                                    onChange={(selected) =>
                                        setFormData((prev) => ({ ...prev, type_space: selected.value }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label form="exampleFormControlInput1" className="form-label"><strong>Sede</strong></label>
                                <Select
                                    data={sedeOptions.map((item) => ({ value: item, label: item }))}
                                    option={{ key: "value", label: "label" }}
                                    value={formData.sede}
                                    onChange={(selected) =>
                                        setFormData((prev) => ({ ...prev, sede: selected.value }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label form="exampleFormControlInput1" className="form-label"><strong>Edificio</strong></label>
                                <Select
                                    data={buildingOptions.map((item) => ({ value: item, label: item }))}
                                    option={{ key: "value", label: "label" }}
                                    value={formData.building}
                                    onChange={(selected) =>
                                        setFormData((prev) => ({ ...prev, building: selected.value }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label form="exampleFormControlInput1" className="form-label"><strong>Piso</strong></label>
                                <Select
                                    data={floorOptions.map((item) => ({ value: item, label: item }))}
                                    option={{ key: "value", label: "label" }}
                                    value={formData.floor}
                                    onChange={(selected) =>
                                        setFormData((prev) => ({ ...prev, floor: selected.value }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label form="exampleFormControlInput1" className="form-label"><strong>Numero</strong></label>
                                <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="Ingrese num. de Aula / Lab"
                                    value={formData.classroom}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, classroom: e.target.value }))
                                    } />
                            </div>
                        </div>
                    </div>

                    <div className="row g-3">
                        <div className="col">
                            <div className="mb-3">
                                <label form="exampleFormControlInput1" className="form-label"><strong>Division</strong></label>
                                <Select
                                    data={divisionOptions.map((item) => ({ value: item, label: item }))}
                                    option={{ key: "value", label: "label" }}
                                    value={formData.division}
                                    onChange={(selected) =>
                                        setFormData((prev) => ({ ...prev, division: selected.value }))
                                    }
                                />
                            </div>
                        </div>
                        <div className="col">
                            <div className="mb-3">
                                <label form="exampleFormControlInput1" className="form-label"><strong>Coordinacion</strong></label>
                                <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com"
                                    value={formData.coordination}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, coordination: e.target.value }))
                                    } />
                            </div>
                        </div>
                    </div>

                    <div>
                        <hr style={{ border: "1px solid" }} />
                        <h4 style={{ marginBottom: "40px" }}>Exclusivo para Aulas o Laboratorios</h4>

                        <div className="row g-3">
                            <div className="col">
                                <div className="mb-3">
                                    <label form="exampleFormControlInput1" className="form-label"><strong>Imagen 1</strong></label>
                                    <div className="mb-3">
                                        <input
                                            className="form-control"
                                            type="file"
                                            id="formFile"
                                            accept="image/*"

                                            onChange={(e) => handleImageUpload(e, 0)}
                                        />
                                        {previewImages[0] && (
                                            <div className="mt-2">
                                                <img
                                                    src={previewImages[0]}
                                                    alt="Previsualización 1"
                                                    style={{ width: "420px", height: "280px", maxWidth: "420px", maxHeight: "280px" }}
                                                    className="img-thumbnail"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="mb-3">
                                    <label form="exampleFormControlInput1" className="form-label"><strong>Imagen 2</strong></label>
                                    <div className="mb-3">
                                        <input
                                            className="form-control"
                                            type="file"
                                            id="formFile"
                                            accept="image/*"

                                            onChange={(e) => handleImageUpload(e, 1)}
                                        />
                                        {previewImages[1] && (
                                            <div className="mt-2">
                                                <img
                                                    src={previewImages[1]}
                                                    alt="Previsualización 2"
                                                    style={{ width: "420px", height: "280px", maxWidth: "420px", maxHeight: "280px" }}
                                                    className="img-thumbnail"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="mb-3">
                                    <label form="exampleFormControlInput1" className="form-label"><strong>Equipamiento</strong></label>
                                    <div className={styles[`container-up-area`]}>
                                        <div className={styles[`button-ticket`]}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="checkboxNoLabel-2"
                                                name="Pantalla"
                                                checked={formData.equipment.includes("Pantalla")}
                                                onChange={handleCheckBoxChange}
                                                style={{ fontSize: "20px", marginRight: "5px", marginTop: "0px" }}
                                            />
                                            <label htmlFor="" style={{ marginRight: "20px" }}><strong>Pantalla</strong></label>
                                        </div>
                                        <div className={styles[`button-ticket`]}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="checkboxNoLabel-2"
                                                name="PC"
                                                checked={formData.equipment.includes("PC")}
                                                onChange={handleCheckBoxChange}
                                                style={{ fontSize: "20px", marginRight: "5px", marginTop: "0px" }}
                                            />
                                            <label htmlFor="" style={{ marginRight: "20px" }}><strong>PC</strong></label>
                                        </div>
                                        <div className={styles[`button-ticket`]}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="checkboxNoLabel-2"
                                                name="Proyector"
                                                checked={formData.equipment.includes("Proyector")}
                                                onChange={handleCheckBoxChange}
                                                style={{ fontSize: "20px", marginRight: "5px", marginTop: "0px" }}
                                            />
                                            <label htmlFor="" style={{ marginRight: "20px" }}><strong>Proyector</strong></label>
                                        </div>
                                        <div className={styles[`button-ticket`]}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="checkboxNoLabel-2"
                                                name="Camara"
                                                checked={formData.equipment.includes("Camara")}
                                                onChange={handleCheckBoxChange}
                                                style={{ fontSize: "20px", marginRight: "5px", marginTop: "0px" }}
                                            />
                                            <label htmlFor="" style={{ marginRight: "20px" }}><strong>Camara</strong></label>
                                        </div>
                                        <div className={styles[`button-ticket`]}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="checkboxNoLabel-2"
                                                name="Bocinas"
                                                checked={formData.equipment.includes("Bocinas")}
                                                onChange={handleCheckBoxChange}
                                                style={{ fontSize: "20px", marginRight: "5px", marginTop: "0px" }}
                                            />
                                            <label htmlFor="" style={{ marginRight: "20px" }}><strong>Bocinas</strong></label>
                                        </div>
                                        <div className={styles[`button-ticket`]}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="checkboxNoLabel-2"
                                                name="Pantalla Proyeccion"
                                                checked={formData.equipment.includes("Pantalla Proyeccion")}
                                                onChange={handleCheckBoxChange}
                                                style={{ fontSize: "20px", marginRight: "5px", marginTop: "0px" }}
                                            />
                                            <label htmlFor="" style={{ marginRight: "20px" }}><strong>Pantalla Proyección</strong></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <hr style={{ border: "1px solid" }} />
                    </div>

                    <div style={{ textAlign: "end" }}>
                        <span style={{ marginRight: "20px" }}><Button
                            text="Guardar datos"
                            size="md"
                            variant="secondary active"
                            onClick={handleSubmit} />
                        </span>
                        <span><Button
                            text="Cancelar"
                            size="md"
                            variant="danger"
                            onClick={() => navigate("/auth/dashboard")} />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateArea;