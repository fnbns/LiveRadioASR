package org.etti.liveradioasr.liveradioasrhttpserver;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.sound.sampled.LineUnavailableException;
import org.etti.speech.liveradioasr.server.RadioTranscriberServer;
import org.etti.speech.liveradioasr.struct.RadioStationInfo;
import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.media.sse.SseFeature;
import org.glassfish.jersey.server.ResourceConfig;




public class App {

    private static final URI BASE_URI = URI.create("http://0.0.0.0:11100/base/");
    public static final String ROOT_PATH = "radioPlayerServer";
    public static final int RADIO_SERVER_PORT = 10321;
    public static final String _radioStationsInfoFile = "../config/radioStations.list";
    public static final String _configFile = "../config/liveRadioASRTranscriber.xml";
    public static final String _speechDataFolder = "/home/serban/LiveRadioASR/transcriptions";
    public static RadioTranscriberServer currentRunningServer ;
    
    public RadioTranscriberServer getRadioTranscriberServer(){
      return currentRunningServer;  
    };
    
    public static void startTranscriptionServer(int _radioServerPort, String _radioStationsInfoFile, String _configFile, String _speechDataFolder) throws IOException, LineUnavailableException, Exception{
     RadioTranscriberServer _server = new RadioTranscriberServer(_radioServerPort, _radioStationsInfoFile, _configFile, _speechDataFolder);
     currentRunningServer = _server ;
     _server.startThreads();   
        
    }

    public static void main(String[] args) throws IOException, LineUnavailableException, Exception {
        

        try {
            startTranscriptionServer(RADIO_SERVER_PORT, _radioStationsInfoFile,_configFile , _speechDataFolder);
           
            System.out.println("\"RadioPlayer Server\" Jersey SSE");
            
            final ResourceConfig resourceConfig = new ResourceConfig(RadioPlayerSSE.class, SseFeature.class);
		resourceConfig.register(CORSResponseFilter.class);           
		 final HttpServer server = GrizzlyHttpServerFactory.createHttpServer(BASE_URI, resourceConfig);
            
            
            

            System.out.println(String.format("Server started.\nTry out %s%s\nHit enter to stop it...",
                    BASE_URI, ROOT_PATH));
            System.in.read();
            server.shutdownNow();
        } catch (IOException ex) {
            Logger.getLogger(App.class.getName()).log(Level.SEVERE, null, ex);
        }

    }
}
