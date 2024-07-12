import { useContext, useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { AuthContext } from "../../context/auth";

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

    const [loading, setLoading] = useState<boolean>(false);
    // const [messageErro, setMessageErro] = useState<string>('');
    const {login, error} = authContext;

    const { register, handleSubmit, formState: { errors } } =
        useForm<ILoginRequest>({ resolver: yupResolver(schema), })

    const onSubmit = async (data: ILoginRequest) => {
        setLoading(true);
        login(data, true);
        setLoading(false);
    }



    return (
        <>{loading ? <div>loading...</div>
            : <div>
                Login
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input {...register("email")} />
                    {<p>{errors.email?.message}</p>}
                    <input {...register("password")} />
                    {<p>{errors.password?.message}</p>}
                    <input type="submit" />
                </form>
                <p>{error}</p>
            </div>}</>
    );
}
export default Login;
