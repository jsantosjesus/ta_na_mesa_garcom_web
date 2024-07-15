import { useContext, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { AuthContext } from "../../context/auth";
import taNaMesaLogo from "../../assets/taNaMesaLogo.png";

import '../../styles/pages/login.sass';

type ILoginRequest = {
    email: string,
    password: string
}

const schema = yup
    .object({
        email: yup.string().required('email requerido').email('email inválido'),
        password: yup.string().required('senha requerida').min(8, 'senha muito pequena'),
    })
    .required()

const Login = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    useEffect(() => {
        console.log('rodou pagina login');
    });

    // const [loading, setLoading] = useState<boolean>(false);
    // const [messageErro, setMessageErro] = useState<string>('');
    const { login, error, loading } = authContext;

    const { register, handleSubmit, formState: { errors } } =
        useForm<ILoginRequest>({ resolver: yupResolver(schema), })

    const onSubmit = async (data: ILoginRequest) => {
        // setLoading(true);
        login(data, true);
        // setLoading(false);
    }



    return (
        <div id='loginBody'>
            <img src={taNaMesaLogo} height='120px'/>
            <div className='bottomLogin'>
            <h1>Login</h1>
            <p>app do garçom</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                {<p id='error'>{errors.email?.message}</p>}
                <input {...register("email")} placeholder='Seu email'/>
                {<p id='error'>{errors.password?.message}</p>}
                <input {...register("password")} placeholder='Sua senha'/>
                {loading ? <p>loading...</p> : <input type="submit" className='btnForm' />}
            </form>
            <p id='error'>{error}</p>
            </div>
        </div>
    );
}
export default Login;
