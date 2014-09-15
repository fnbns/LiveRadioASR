
package org.etti.liveradioasr.liveradioasrhttpserver;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.UriInfo;
import org.etti.speech.liveradioasr.server.ClientPeer;
import org.etti.speech.liveradioasr.struct.RadioTranscriberClient;
import org.etti.speech.liveradioasr.server.RadioTranscriberServer;
import org.etti.speech.liveradioasr.struct.RadioStationInfo;
import org.etti.speech.liveradioasr.struct.TranscriptionResponse;
import org.etti.speech.liveradioasr.struct.TranscriptionUpdate;
import org.glassfish.jersey.media.sse.EventOutput;
import org.glassfish.jersey.media.sse.OutboundEvent;
import org.glassfish.jersey.media.sse.SseFeature;

/**
 *
 * @author alex
 */
//@Path("radioPlayerServer")
@Path("radioPlayerServer")
public class RadioPlayerSSE {
  
    private RadioTranscriberServer parent;
    private App app ;

 @Context
 Request request;
 @GET
    @Produces(SseFeature.SERVER_SENT_EVENTS)
    public EventOutput getServerSentEvents(@QueryParam("radioname") final String radioName) {
        final EventOutput eventOutput = new EventOutput();
        final Request _request = request;
        final RadioTranscriberClient _radioClient = new RadioTranscriberClient(_request.toString(), radioName);
        System.out.println("This is the request" + _request);
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    parent = App.currentRunningServer;
                    parent.addRadioTranscriberClient(_radioClient);
                    for (String line : sendRadioTranscriptionResponse(radioName).getTranscription()) {
                        final OutboundEvent.Builder eventBuilder
                        = new OutboundEvent.Builder();
                        eventBuilder.data(String.class,
                            line);
                        final OutboundEvent event = eventBuilder.build();
                        eventOutput.write(event);
                        }
                    while (true) {
                        // waits for toBeSentTranscriptionUpdates to be populated
                        Thread.sleep(1000);
                        if (!(_radioClient.getToBeSentTranscriptionUpdates().isEmpty())) {
                            List<TranscriptionUpdate> toBeSentTranscriptionUpdates = _radioClient.getToBeSentTranscriptionUpdates();
                            for (TranscriptionUpdate _transcUpdate : toBeSentTranscriptionUpdates) {
                                //outputStream.writeObject(_transcUpdate);
                                OutboundEvent.Builder eventBuilder
                                        = new OutboundEvent.Builder();
                                //eventBuilder.name("message-to-client");
                                eventBuilder.data(String.class,
                                        _transcUpdate.getUpdatedTranscription());
                                  final OutboundEvent event = eventBuilder.build();
                                  eventOutput.write(event);
                            }
                            toBeSentTranscriptionUpdates.removeAll(toBeSentTranscriptionUpdates);
                        }
                        }
                } catch (IOException e) {
                    parent.removeRadioTranscriberClient(_radioClient);
                    throw new RuntimeException(
                        "Error when writing the event.", e);
                } catch (InterruptedException ex) {
                    Logger.getLogger(RadioPlayerSSE.class.getName()).log(Level.SEVERE, null, ex);
                } finally {
                    try {
                        eventOutput.close();
                    } catch (IOException ioClose) {
                        throw new RuntimeException(
                            "Error when closing the event output.", ioClose);
                    }
                }
            }
        }).start();
        return eventOutput;
    }
//-------------------------------------------------------------------------------------
    /**
     * This method sends TranscriptionResponse objects to client consisting in a
     * list of transcriptions for the whole day
     *
     * @param _radioStationShortName ...
     * @throws FileNotFoundException
     * @throws IOException
     */
    private TranscriptionResponse sendRadioTranscriptionResponse(String _radioStationShortName) throws FileNotFoundException, IOException {
        //Obtain the transcription file name
        parent = App.currentRunningServer;
        String _fileName = null;
        for (RadioStationInfo _radioInfo : parent.getRadioStationsInfo()) {
            if (_radioStationShortName.equals(_radioInfo.getRadioShortName())) {
                _fileName = _radioInfo.getTranscriptionCompleteFilePath(new Date());
            }
        }

        //Read the transcription file
        TranscriptionResponse _response = new TranscriptionResponse(Files.readAllLines(Paths.get(_fileName), Charset.defaultCharset()));
        return _response;
    }
}
    
    

