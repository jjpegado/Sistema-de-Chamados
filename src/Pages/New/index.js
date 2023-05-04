import { useState, useEffect, useContext } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiPlusCircle } from "react-icons/fi";

import { AuthContext } from "../../contexts/auth";
import { db } from "../../services/firebaseconnection";
import { collection, getDocs, getDoc, doc, updateDoc, addDoc} from "firebase/firestore";

import { useParams, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import './new.css';

const listRef = collection(db, "customers");

export default function New(){
const { user } = useContext(AuthContext);
const { id } = useParams();
const navigate = useNavigate();

const [customersSelected, setCustomersSelected] = useState(0)
const [customers, setCustomers] = useState({})
const [loadCustomer, setLoadCustomer] = useState(true);

const [complemento, setComplemento] = useState('')
const [assunto, setAssunto] = useState('Suporte')
const [status, setStatus] = useState('Aberto')
const [idCustomer, setIdCustomer] = useState(false)



useEffect(() => {
    async function loadCustomer(){
        const querySnapshot = await getDocs(listRef)
        .then( (snapshot) => {
            let lista = [];

            snapshot.forEach((doc) => {
                lista.push({
                  id: doc.id,
                  nomeFantasia: doc.data().nomeFantasia  
                })
            })

            if(snapshot.docs.size === 0){
                console.log("NENHUM EMPRESA ENCONTRADA");
                setCustomers([ { id: '1', nomeFantasia: 'FREELA'} ])
                setLoadCustomer(false);
                return;
            }

            setCustomers(lista);
            setLoadCustomer(false);

            if(id){
                loadId(lista);
            }
        })
        .catch((error) => {
            console.log("ERRO AO BUSCAR OS CLIENTES", error)
            setLoadCustomer(false);
            setCustomers([ { id: '1', nomeFantasia: 'FREELA' } ])
        })
    }
    
    loadCustomer();
}, [id])


async function loadId(Lista){
    const docRef = doc(db, "chamados", id);
    await getDoc(docRef)
    .then((snapshot) => {
        setAssunto(snapshot.data().assunto)
        setStatus(snapshot.data().status)
        setComplemento(snapshot.data().complemento);


        let index = Lista.findIndex(item => item.id === snapshot.data().clienteId)
        setCustomersSelected(index);
        setIdCustomer(true);


    })
    .catch((error) => {
        console.logo(error);
        setIdCustomer(false);
    })
}


function handleChangeSelect(e){
    setAssunto(e.target.value)
}


function handleOptionChange(e){
    setStatus(e.target.value);
}


function handleChangeCustomer(e){
    setCustomersSelected(e.target.value)
}

async function handleRegister(e){
    e.preventDefault()

    if(idCustomer){
        //Atualizando chamado
        const docRef = doc(db, "chamados", id)
        await updateDoc(docRef, {
            cliente: customers[customersSelected].nomeFantasia,
            clienteId: customers[customersSelected].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userId: user.uid,
        })
        .then(() => {
            toast.info("Chamado atualizado com sucesso!")
            setCustomersSelected(0);
            setComplemento('');
            navigate('/dashboard')
        })
        .catch((error) => {
            toast.error("Ops error ao atualizar esse chamado!")
            console.log(error);
        })

        return;
    }


    //Registrar um chamado no FireBase
    await addDoc(collection(db, "chamados"), {
        created: new Date(),
        cliente: customers[customersSelected].nomeFantasia,
        clienteId: customers[customersSelected].id,
        assunto: assunto,
        complemento: complemento,
        status: status,
        userId: user.uid,
    })
    .then(() => {
        toast.success("Chamado registrado!")
        setComplemento('')
        setCustomersSelected(0)
    })
    .catch((error) => {
        toast.success("Ops erro ao registrar, tente mais tarde!")
        console.log(error);
    })
}

    return(
        <div>
            <Header/>

            <div className="content">
                <Title name={id ? "Editando Chamado" : "Novo Chamado"}>
                    <FiPlusCircle size={25}/>
                </Title>


                <div className="container">
                    <form className="form-profile" onSubmit={handleRegister}>

                        <label>Cliente</label>
                        {
                            loadCustomer ? (
                                <input type="text" disabled={true} value="carregando..."/> 
                            ) : (
                                <select value={customersSelected} onChange={handleChangeCustomer}>
                                    {customers.map((item, index) => {
                                        return(
                                            <option key={index} value={index}>
                                                {item.nomeFantasia}
                                            </option>
                                        )
                                    })}
                               
                                </select>
                            )
                        }

                        <label>Assunto</label>
                        <select value={assunto} onChange={handleChangeSelect}>
                            <option  value="Suporte">Suporte</option>
                            <option  value="Visita Tecnica">Visita Tecnica </option>
                            <option  value="Financeiro">Financeiro </option>
                        </select>

                        <label>Status</label>
                        <div className="status">
                            <input
                            type="radio"
                            name="radio"
                            value="Aberto" 
                            onChange={handleOptionChange}
                            checked={ status === 'Aberto'}
                            />

                        <span>Em aberto</span>

                        <input
                            type="radio"
                            name="radio"
                            value="Progresso" 
                            onChange={handleOptionChange}
                            checked={ status === 'Progresso'}
                            />

                        <span>Progresso</span>

                        <input
                            type="radio"
                            name="radio"
                            value="Atendido" 
                            onChange={handleOptionChange}
                            checked={ status === 'Atendido'}
                            />

                        <span>Atendido</span>

                        </div>

                        <label>Complemento</label>
                        <textarea
                            type="text"
                            placeholder="Descreva seu problema"
                            value={complemento}
                            onChange={ (e) => setComplemento(e.target.value)}
                        />

                        <button type="submit">Registrar</button>

                    </form>
                </div>
            </div>
        </div>
    )
}