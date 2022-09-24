import { useSession, getSession } from 'next-auth/react';
import { useRouter } from "next/router";
import Layout from "../components/Layout/Layout";
import About from "../components/Dashboard/About"
import Location from "../components/Dashboard/Location";
import Skills from "../components/Dashboard/Skills";
import WizelineLevel from "../components/Dashboard/WizelineLevel";
import Availability from "../components/Dashboard/Availability";
import LastProject from "../components/Dashboard/LastProject";
import SocialMedia from "../components/Dashboard/SocialMedia";
import ErrorContainer from "../components/Templates/ErrorContainer";
import { getDashboard } from '../lib/fetching/dashboard';
import { getSkills } from "../lib/fetching/skills";

function Profile({ query, renderData }) {
    const { data: session } = useSession();
    const dashboardUser = query.user_id;
    let sessionDataToLayout = null;
    
    const router = useRouter();

    async function refreshData(){
      router.replace(router.asPath, undefined, { scroll: true });
    };

    if (session) {
        sessionDataToLayout = {
          id: session.user.id,
          image: session.user.image,
          name: session.user.name,
          occupation: session.user.occupation,
          role: session.user.role,
        }
    }

    if (session && session.user.id == dashboardUser) { // This is editable returned page
      return (
        <Layout sessionData={sessionDataToLayout} viewingUser={{id: renderData.dashboardData.id, name: renderData.dashboardData.name, image: renderData.dashboardData.image}}>
            <div className="w-full grid grid-rows-4 grid-cols-1 lg:grid-rows-2 lg:grid-cols-2 gap-[1rem]">
                {/* Division 1 */}
                {/* About Division */}
                <About userId={session.user.id} viewingUserId={dashboardUser} image={renderData.dashboardData.image} name={renderData.dashboardData.name} occupation={renderData.dashboardData.occupation} 
                bio={renderData.dashboardData.dashboard.bio} onRefresh={() => router.reload()}/>
                {/* Division 2 */}
                {/* Location Division */}
                <Location userId={session.user.id} viewingUserId={dashboardUser} timezone={renderData.dashboardData.dashboard.time_zone} location={renderData.dashboardData.dashboard.location} 
                latitude={renderData.dashboardData.dashboard.latitude} longitude={renderData.dashboardData.dashboard.longitude} onRefresh={() => refreshData()}/>
                {/* Division 3 */}
                <div className='h-[12rem] md:h-[15rem] lg:h-[18rem] w-full flex flex-row gap-[1rem]'>
                  {/* Skills Division */}
                  <Skills userId={session.user.id} viewingUserId={dashboardUser} dashboardId={renderData.dashboardData.dashboard.dashboard_id} userSkills={renderData.dashboardData.dashboard.dashboard_skills} skills={renderData.skillsData} onRefresh={() => refreshData()}/>
                  {/* Wizeline Level Division */}
                  <WizelineLevel userId={session.user.id} viewingUserId={dashboardUser} level={renderData.dashboardData.dashboard.level}/>
                </div>
                {/* Division 4 */}
                <div className='h-[12rem] md:h-[15rem] lg:h-[18rem] w-full grid grid-rows-2 gap-[1rem]'>
                  {/* Division 4.1 */}
                  <div className='h-full w-full flex flex-row gap-[1rem]'>
                    {/* Availability Division */}
                    <Availability userId={session.user.id} viewingUserId={dashboardUser} availability={renderData.dashboardData.dashboard.availability} onRefresh={() => refreshData()}/>
                    {/* Last Project Division */}
                    <LastProject userId={session.user.id} viewingUserId={dashboardUser} project={renderData.dashboardData.experiences[0]}/>
                  </div>
                  {/* Division 4.2 */}
                  {/* Social Networks Division */}
                  <SocialMedia userId={session.user.id} viewingUserId={dashboardUser} dashboardId={renderData.dashboardData.dashboard.dashboard_id} 
                  socialLinks={renderData.dashboardData.dashboard.socialLinks} onRefresh={() => refreshData()}/>
                </div>
            </div>
        </Layout>  
      )
    }

    if (renderData) {
      return (
        <Layout sessionData={sessionDataToLayout} viewingUser={{id: renderData.dashboardData.id, name: renderData.dashboardData.name, image: renderData.dashboardData.image}}>
            <div className="w-full grid grid-rows-4 grid-cols-1 lg:grid-rows-2 lg:grid-cols-2 gap-[1rem]">
                {/* Division 1 */}
                {/* About Division */}
                <About viewingUserId={dashboardUser} image={renderData.dashboardData.image} name={renderData.dashboardData.name} occupation={renderData.dashboardData.occupation} 
                bio={renderData.dashboardData.dashboard.bio} onRefresh={() => router.reload()}/>
                {/* Division 2 */}
                {/* Location Division */}
                <Location viewingUserId={dashboardUser} timezone={renderData.dashboardData.dashboard.time_zone} location={renderData.dashboardData.dashboard.location} 
                latitude={renderData.dashboardData.dashboard.latitude} longitude={renderData.dashboardData.dashboard.longitude} onRefresh={() => refreshData()}/>
                {/* Division 3 */}
                <div className='h-[12rem] md:h-[15rem] lg:h-[18rem] w-full flex flex-row gap-[1rem]'>
                  {/* Skills Division */}
                  <Skills viewingUserId={dashboardUser} userSkills={renderData.dashboardData.dashboard.dashboard_skills}/>
                  {/* Wizeline Level Division */}
                  <WizelineLevel viewingUserId={dashboardUser} level={renderData.dashboardData.dashboard.level}/>
                </div>
                {/* Division 4 */}
                <div className='h-[12rem] md:h-[15rem] lg:h-[18rem] w-full grid grid-rows-2 gap-[1rem]'>
                  {/* Division 4.1 */}
                  <div className='h-full w-full flex flex-row gap-[1rem]'>
                    {/* Availability Division */}
                    <Availability viewingUserId={dashboardUser} availability={renderData.dashboardData.dashboard.availability} onRefresh={() => refreshData()}/>
                    {/* Last Project Division */}
                    <LastProject viewingUserId={dashboardUser} project={renderData.dashboardData.experiences[0]}/>
                  </div>
                  {/* Division 4.2 */}
                  {/* Social Networks Division */}
                  <SocialMedia viewingUserId={dashboardUser} socialLinks={renderData.dashboardData.dashboard.socialLinks}/>
                </div>
            </div>
        </Layout>
      )
    } else {
      return (
        <Layout sessionData={sessionDataToLayout}>
          <ErrorContainer code={404} message={"Profile not found."}/>
        </Layout>
      )
    }
}

export const getServerSideProps = async (context) => {
  
  const session = await getSession(context)
  const dashboardRes = await getDashboard(context.query.user_id)

  if (dashboardRes.ok) {
    const dashboard = await dashboardRes.json();

    if (session) {

      if (session.user.id == dashboard.id){

        const skillsRes = await getSkills()

        if (skillsRes.ok) {
          const skills = await skillsRes.json()
          return {
            props: {
              session: session,
              query: context.query,
              renderData: {
                dashboardData: dashboard,
                skillsData: skills
              }
            }
          }
        } else {
          throw new Error(skillsRes.statusText);
        }
      }

      return {
        props: {
          session: session,
          query: context.query,
          renderData: {
            dashboardData: dashboard
          }
        }
      }
      
    }

    return {
      props: {
        query: context.query,
        renderData: {
          dashboardData: dashboard
        }
      }
    }
    
  } else {
    if (session) {
      return {
        props: {
          session: session,
          query: context.query,
        }
      }
    }

    return {
      props: {
        query: context.query,
      }
    }
  }
}

export default Profile