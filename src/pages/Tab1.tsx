import React, {useState} from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonInput,
    useIonViewWillEnter,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonList,
    IonButton,
    IonItem,
    IonIcon,
    IonToast
} from '@ionic/react';
import { addOutline, trashBinOutline, pencil } from 'ionicons/icons';
import {firebaseConfig} from '../database/config'
import firebase from 'firebase/app'; // npm i firebase
import './Tab1.css';
import 'firebase/firebase-firestore';
import {equipo} from '../modelo/equipo'

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const Tab1: React.FC = () => {

    const [listaEquipo, setListaEquipo] = useState < equipo[] > ([]); 
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [titulos, setTitulos] = useState('');
    const [mensaje, setMensaje] = useState(false);
    const [bandera, setBandera] = useState(true);
    const listar = async () => {
        try {
            let lista: equipo[] = []
            const res = await firebase.firestore().collection('equipo').get();
            res.forEach((doc) => {
                let obj = {
                    id: doc.id,
                    nombre: doc.data().nombre,
                    titulos: doc.data().titulos
                };
                lista.push(obj)
    
            });
            setListaEquipo(lista)
        } catch (error) {}
    }

    const crear = async () => {
        try {
            if(bandera){
                await firebase.firestore().collection('equipo').add(
                    {nombre, titulos});
                   
            }else{
                await firebase.firestore().collection('equipo').doc(id).set(
                    {nombre, titulos});
                    setBandera(true);
            }
             
        } catch (error) {}
        setId('');
        setNombre('');
        setTitulos('');
        setMensaje(true);
        listar();  
    }


    const eliminar = async(id:string) =>{
        try {
            console.log(id)
            await firebase.firestore().collection('equipo').doc(id).delete();
            listar();  
        } catch (error) {}       
    }

    const editar = (id:string,nombre:string,titulo:string) => {
      setId(id);
      setNombre(nombre);
      setTitulos(titulo);
      setBandera(false);
  } 

    useIonViewWillEnter(() => {
        listar();
    })


  
    return (
        <IonPage>
        <IonToast
           isOpen={mensaje}
           onDidDismiss={() => setMensaje(false)}
           message="equipo guardado"
           duration={500}
          />
            <IonHeader>
                <IonToolbar color="warning">
                    <IonTitle>CRUD IONIC REACT FIREBASE</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Equipo</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonCard>
                    <IonItem>
                        <IonInput value={nombre}
                            placeholder="Nombre Equipo"
                            onIonChange={ e => setNombre(e.detail.value!) }
                        ></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonInput value={titulos}
                            placeholder="Cantidad Titulos"
                            onIonChange={ e => setTitulos(e.detail.value!) }
                        ></IonInput>
                    </IonItem>
                <IonButton color="success" expand="block"
                    onClick={() => crear() }>
                        <IonIcon icon={addOutline}>
                        </IonIcon>{bandera?'Equipo':'Editar'}</IonButton>
                </IonCard>
                <IonList> {
                    listaEquipo.map(equipo => (
                        <IonCard key={equipo.id} >
                            <IonCardHeader>
                                <IonCardTitle>Nombre:{
                                    equipo.nombre
                                }</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                Titulos: {equipo.titulos} 
                                <IonButton color="danger" expand="block"
                               onClick={() => eliminar(''+equipo.id)}>
                             <IonIcon icon={trashBinOutline}></IonIcon>
                               Eliminar</IonButton>  
                        <IonButton color="tertiary" expand="block"
                         onClick={
                    () => editar(''+equipo.id,''+equipo.nombre,''+equipo.titulos)}>
                             <IonIcon icon={pencil}></IonIcon>Editar</IonButton>   
                            </IonCardContent>
                             
                        </IonCard>
                    )) }
                 </IonList>
            </IonContent>
        </IonPage>
    );
};
export default Tab1;
